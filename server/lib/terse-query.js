'use strict';
require('isomorphic-fetch');
const fetchres = require('fetchres');
const AsciiTable = require('ascii-table');
const querystring = require('querystring');

function isSingleNumber (res) {
	return Object.keys(res).length === 1 && typeof res.result === 'number';
}

function arrayN (n) {
	return Array(n).join('.').split('.').map(v => undefined);
}

function stringN (n) {
	return Array(n + 1).join(' ');
}


let renderers = {
	json: function (curr, prev) {
		return {curr,prev};
	},

	ascii: function (curr, prev) {

		if (isSingleNumber(curr)) {
			return `${this.name}\nCurrent value: ${curr.result}\nPrevious value: ${prev.result}`;
		} else {

			const table = new AsciiTable(this.name)
			table
			  .setHeading('', 'Current', 'Previous')

			let rows;
			if (this.query.interval && !this.query.group_by) {
				rows = arrayN(curr.result.length).map((v, i) => {
					return `${this.intervalUnit} ${i + 1}`;
				})
				rows.forEach((k, i) => {
					try {
						table.addRow(k, curr.result[i].value, prev.result[i].value)
					} catch (e) {
						table.addRow(k, '#ERR', '#ERR')
					}
				})

			} else if (!this.query.interval && this.query.group_by) {
				rows = Object.keys(curr.result.concat(prev.result).reduce((map, res) => {
					map[res[this.query.group_by]] = true;
					return map;
				}, {}))
				rows.forEach(k => {
					let currRes = curr.result.find(r => r[this.query.group_by] === k);
					let prevRes = prev.result.find(r => r[this.query.group_by] === k);
					table.addRow(k, currRes && currRes.result, prevRes && prevRes.result);
				})
			} else {
				throw new Error ('Ascii tables not supported when interval and group by both specified')
			}
			return table.toString();
		}
	},

	html: (curr, prev) => {

	}
}

const shorthandMap = {
	'=': {
		operator: 'eq',
	},
	'!=': {
		operator: 'not_eq',
	},
	'>>': {
		operator: 'contains'
	},
	'>': {
		operator: 'gt',
	},
	'<': {
		operator: 'lt',
	},
	'<<': {
		operator: 'contained_in',
		handleList: true
	}
};

const intervalMappings = {
	m: 'minutely',
	h: 'hourly',
	d: 'daily',
	w: 'weekly',
	mo: 'monthly',
	y: 'yearly',
}

const intervalUnitMappings = {
	m: 'minute',
	h: 'hour',
	d: 'day',
	w: 'week',
	mo: 'month',
	y: 'year',
}

function coerceNumber (number) {
	try {
		return Number(value)
	} catch (e) {
		return value;
	}
}

function transformValue(value, handleList) {
	if (handleList === true) {
		return value.split(/,\s/g)
			.map(transformValue);
	}

	if (value === 'true') {
		return true;
	}	else if (value === 'false') {
		return false;
	}

	try {
		return Number(value)
	} catch (e) {}
}

function constructComplexFilter (filterString) {
	let filterConf = /^(.*)(=|\!=|>>|>|<|<<)(.*)$/.exec(filterString);
	filterConf = {
		property_name: filterConf[1],
		operator: shorthandMap[filterConf[2]].operator,
		property_value: transformValue(filterConf[3], shorthandMap[filterConf[2]].transformValues)
	}
}

class TerseQuery {
	constructor (event, name) {
		this.event = event;
		this.name = 'Query: ' + (name || '');
		this.query = {
			event_collection: event
		};
		this.filters = [];
	}

	setExtraction (name) {

		if (this.extraction) {
			throw new Error(`Cannot run ${name} extraction, extraction type already set to ${this.query.extraction}`);
		}
		this.extraction = name
	}

	count (prop) {
		if (prop) {
			this.setExtraction('count_unique')
			this.query.target_property = prop;
		} else {
			this.setExtraction('count')
		}
		return this;
	}

	time (time, interval) {
		if (time) {
			if (parseInt(time, 10) === Number(time)) {
				time = time + '_days';
			}
		} else {
			time = '14_days';
		}
		this.timespan = time;
		if (interval) {
			this.query.interval = intervalMappings[interval] || 'daily';
			this.intervalUnit = intervalUnitMappings[interval] || 'day';
		}
		return this;
	}

	group (prop) {
		if (this.query.group_by) {
			throw new Error(`Can't group by ${prop}, already grouping by ${this.query.group_by}`)
		}
		this.query.group_by = prop;
		return this;
	}
	generateKeenUrls () {
		this.query.filters = JSON.stringify(this.filters);
		const timeframe = this.timespan || '14_days';
		const baseUrl = [
			`https://api.keen.io/3.0/projects/${process.env.KEEN_PROJECT_ID}/queries/${this.extraction}?api_key=${process.env.KEEN_READ_KEY}`,
			`${querystring.stringify(this.query)}`
		].join('&');
		if (!this.timespan) {
			this.time();
		}
		return {
			curr: baseUrl + `&timeframe=this_${this.timespan}`,
			prev: baseUrl + `&timeframe=previous_${this.timespan}`,
		}
	}
	print (style) {
		const urls = this.generateKeenUrls();

		if (style === 'url') {
			return Promise.resolve(urls);
		}

		return Promise.all([
			fetch(urls.curr),
			fetch(urls.prev)
		])
			.then(fetchres.json)
			.then(([curr, prev]) => {
				const renderer = renderers[style] || renderers.json;
				return renderer.call(this, curr, prev);
			})
	}

	filter (filter) {
		const unary = /^(\!)?([\w\.]+)$/.exec(filter);
		if (unary) {
			this.filters.push({
				property_name: unary[2],
				operator: 'exists',
				property_value: !unary[1]
			})
		} else {
			this.filters.push(constructComplexFilter(filter));
		}
		return this;
	}

}

module.exports = TerseQuery;

TerseQuery.extendPrintMethods = (additionalMethods) => {

}

TerseQuery.parse = (str) => {
  const eventName = /^[\w\-]+\:[\w\-]+\w/.exec(str)[0];
  const transforms = str.split('->').slice(1)
  	.map(str => {
  		const parts = /([a-z]+)\(([^\)]*)\)/.exec(str);
  		return {
  			name: parts[1],
  			params: parts[2] && parts[2].split(/,\s*/g)
  		}
  	});
  if (['count', 'avg'].indexOf(transforms[0].name) === -1) {
  	throw new Error('Must start query chains with valid extraction type: avg or count');
  }
  const terseQuery = new TerseQuery(eventName, str);

  transforms.reduce((query, transform) => {
  	return query[transform.name].apply(query, transform.params || []);
  }, terseQuery)
  	.then(r => console.log(r))
  	.catch(r => console.log(r))

}

// TerseQuery.parse('page:view->count()->group(device.browserName)->print(ascii)');
	// area: (curr, prev) => {

	// },

	// line: (curr, prev) => {

	// },

	// pie: (curr, prev) => {

	// },

	// bar: (curr, prev) => {

	// },

// page:view->count()
// page:view->count(prop) => count_unique
// page:view->count(prop)->group(prop)->print(pct, abs, trend, total)
// page:view->count(prop)->filter()
// page:view->avg()

// ->print()

// print
// filters:

// - prop=val
// - prop!=val
// - prop>>val (val is contained in prop)
// - prop>val
// - prop<val
// - prop<<[val] (prop is contained in val)
// - prop
// - !prop

// https://api.keen.io/3.0/projects/56671212d2eaaa6dd6483dae/queries/count?api_key=edb60e0f8757994d565bbfa79a6392e9e970454f90c553c0d680889c63e935026dc69fa8073a3ee753124c8acc698a8c0199773168d5871b83bbea613a66301ed3eb370653e0c9f26b4269f0f20675136f3bedb50471f50884db43490705e46c23e69a5fdf770dac558bb85f28e6aa8c&event_collection=page%3Aview&group_by=content.classification&interval=minutely&timezone=UTC&timeframe=previous_14_days&filters=%5B%5D
// 56671212d2eaaa6dd6483dae
// api_key=edb60e0f8757994d565bbfa79a6392e9e970454f90c553c0d680889c63e935026dc69fa8073a3ee753124c8acc698a8c0199773168d5871b83bbea613a66301ed3eb370653e0c9f26b4269f0f20675136f3bedb50471f50884db43490705e46c23e69a5fdf770dac558bb85f28e6aa8c
