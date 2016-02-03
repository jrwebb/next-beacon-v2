'use strict';

// TODO Update this code to generate appropriate charts depending on the data;
// e.g. if the data is a single number, it's a metric (o-big-number),
// but if it's multi-column data, then render a HTML table.

import humanize from 'humanize-plus';

const bigNumber = (query, alias) => {

	let html = `<div class="o-big-number o-big-number--standard" title="${alias.question}">`

	if (alias.question) {
		html += `<div class="o-big-number__content o-big-number__content--question chart-question">${alias.question}</div>`;
	}

	const niceNumber = humanize.compactInteger(query.getTable().data, 1);
	html += `<div class="o-big-number__title chart-data">${niceNumber}</div>`;

	if (alias.label) {
		html += `<div class="o-big-number__content chart-label">${alias.label}</div>`;
	}

	return html + `</div>`;
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
	}
}
