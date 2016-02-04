'use strict';

// Utilities for user interface (ui) elements
module.exports = {
	renderChartUI: (el, kq, alias) => {
		const uiEl = el.querySelector('.chart-container__ui');
		if (!uiEl) return;

		uiEl.insertAdjacentHTML('beforeend', `<a href="${kq.generateKeenUrl('/data/explorer?', 'keen-explorer')}">View in keen explorer</a>`);
	}
};
