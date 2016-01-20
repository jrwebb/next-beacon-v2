'use strict';

// TODO Update this code to generate appropriate charts depending on the data;
// e.g. if the data is a single number, it's a metric (o-big-number),
// but if it's multi-column data, then render a HTML table.

const chartui = require('../components/chartui');

const bigNumber = (query, alias) => {
	return `<div class="o-big-number o-big-number--standard">
	<div class="o-big-number__content o-big-number__content--question">${alias.question}</div>
	<div class="o-big-number__title" title="${alias.question}">${query.getTable().data}</div>
	<div class="o-big-number__content">${alias.label}</div>
</div>`;
}

const table = (query, alias) => {
	const data = query.getTable().humanize('human');
	let html = `<h2>${alias.question} - ${alias.label}</h2><table class="o-table"><thead><tr>`;
	data.headings.forEach(h => {
		html +=	`<th>${h}</th>`;
	})
	html += '</tr></thead><tbody>';
	data.rows.forEach(r => {
		html += '<tr>'
		r.forEach((c, i) => {
			if (i === 0) {
				html +=	`<th>${c}</th>`;
			} else {
				// TODO don't use numeric if extraction is select
				html +=	`<td data-o-table-data-type="numeric">${c}</td>`;
			}
		})
		html += '</tr>'
	})

	html += '</tbody></table>'
	return html;
}

module.exports = function () {
	return (el, alias) => {
		el.innerHTML = this.getTable().dimension ? table(this, alias) : bigNumber(this, alias);

		chartui.renderChartUI(el, alias);
	}
}




// 'use strict';

// function html (data) {

// }

// module.exports = function () {
// 	const data = this.tabulate(curr, prev);
// 	const tableTitle = (this.name ? this.name + ':<br>' : '') + this.toString() + ': ' + this.timespan;
// 	if (data.length === 1) {
// 		data[0].name = tableTitle;
// 		return html(data[0]);
// 	} else {
// 		return [`<h2>${tableTitle}</h2>`].concat(data.map(html)).join('\n\n');
// 	}
// }
