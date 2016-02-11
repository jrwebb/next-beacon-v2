'use strict';

function html (data) {
	let html = '<table><thead><tr>';
	data.headings.forEach(h => {
		html +=	`<th>${h}</th>`;
	})
	html += '</tr></thead><tbody>';
	data.rows.forEach(r => {
		html += '<tr>'
		r.forEach(c => {
			html +=	`<td>${c}</td>`;
		})
		html += '</tr>'
	})

	html += '</tbody></table>'
	return html;
}

module.exports = function (curr, prev) {
	const data = this.tabulate(curr, prev);
	const tableTitle = (this.name ? this.name + ':<br>' : '') + this.toString() + ': ' + this.timespan;
	if (data.length === 1) {
		data[0].name = tableTitle;
		return html(data[0]);
	} else {
		return [`<h2>${tableTitle}</h2>`].concat(data.map(html)).join('\n\n');
	}
}
