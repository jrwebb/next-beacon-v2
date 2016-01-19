'use strict';

// TODO Update this code to generate appropriate charts depending on the data;
// e.g. if the data is a single number, it's a metric (o-big-number),
// but if it's multi-column data, then render a HTML table.

const chartui = require('../components/chartui');

module.exports = function () {
	return (el, alias) => {
		let html = `<div class="o-big-number o-big-number--standard">`;
		html += `	<div class="o-big-number__title" title="${alias.question}">${this.getTable().data}</div>`;
		html += `	<div class="o-big-number__content">${alias.label}</div>`;
		html += `</div>`;
		el.innerHTML = html;

		chartui.renderChartUI(el, alias);
	}
}
