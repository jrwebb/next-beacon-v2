'use strict';

// Utilities for user interface (ui) elements
const updateChartUI = (el, html) => {
	const ui = el.getElementsByClassName('chart-ui');
	if (ui.length < 1) {
		el.innerHTML += `<div class="chart-ui">${html}</div>`;
	}
	else {
		ui[0].innerHTML += html;
	}
}

module.exports = {
	renderExplorerLink: (el, alias) => {
		updateChartUI(el, `<div class="explorer-link"><a target="_blank" href="${alias.explorerURL}">Explore</a></div>`);
	},
	renderChartLink: (el, alias) => {
		updateChartUI(el, `<div class="chart-link"><a href="/chart/${alias.name}">Chart</a></div>`);
	}
}

