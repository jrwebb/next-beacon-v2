'use strict';

// Utilities for user interface (ui) elements

const renderChartUI = (el, alias) => {
	let linksHTML = getChartLinkHTML(alias.name);
	if (alias.explorerURL) {
		linksHTML += getExplorerLinkHTML(alias.explorerURL);
	}
	let childEl = document.createElement('div');
	childEl.className = 'chart-ui';
	childEl.innerHTML = linksHTML;
	el.appendChild(childEl);
}
const getChartLinkHTML = (name) => {
	return `<div class="chart-link"><a href="/chart/${name}">Chart</a></div>`;
}
const getExplorerLinkHTML = (explorerURL) => {
	return `<div class="explorer-link"><a target="_blank" href="${explorerURL}"><i class="o-ft-icons-icon o-ft-icons-icon--sign-out"></i>Explore</a></div>`;
}
module.exports = {
	renderChartUI:renderChartUI
}
