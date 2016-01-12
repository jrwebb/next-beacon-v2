'use strict';

// TODO Update this code to generate appropriate charts depending on the data;
// e.g. if the data is a single number, it's a metric (o-big-number),
// but if it's multi-column data, then render a HTML table.

module.exports = function (data) {
	return function (el, alias) {
		console.log('html',el,alias);

		let html = `<div class="o-big-number o-big-number--standard">`;
		html    += `	<div class="o-big-number__title" title="${alias.label}">${data.result}</div>`;
		html    += `	<div class="o-big-number__content">${alias.label}</div>`;
		html    += `</div>`;

		el.innerHTML = html;
	}
}
