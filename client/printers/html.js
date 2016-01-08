'use strict';

module.exports = function (aliasData) {
	return function (el) {
		console.log('html',el,aliasData);

		let metric = `<div class="o-big-number o-big-number--standard">`;
		metric    += `	<div class="o-big-number__title" title="${aliasData.label}">${aliasData.result}</div>`;
		metric    += `	<div class="o-big-number__content">${aliasData.label}</div>`;
		metric    += `</div>`;
		el.innerHTML = metric;
	}
}
