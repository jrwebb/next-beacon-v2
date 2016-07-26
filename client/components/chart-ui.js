import Delegate from 'dom-delegate';
import {retrieveKq} from '../data/kq-cache';
import {fromForm as getConfigurator} from './configurator';
import {renderChart} from './chart';

function copyData (ev) {
	ev.preventDefault();
	const container = getChartContainer(ev.target);
	const chartName = container.dataset.chartName;
	const kq = retrieveKq(`${chartName}:printed`);

	const copyTextarea = document.createElement('textarea');

	copyTextarea.textContent = kq.toTSV();
	container.appendChild(copyTextarea);
	copyTextarea.select();

	try {
		document.execCommand('copy');
		container.removeChild(copyTextarea);
		ev.target.insertAdjacentHTML('beforeend', '<span style="color: black"> - Copied!</span>');
		setTimeout(() => {
			const span = ev.target.querySelector('span');
			span.parentNode.removeChild(span);
		}, 1500);
	} catch (err) {
		container.removeChild(copyTextarea);
		alert('Oops, unable to copy');
	}
}

function getChartContainer (el) {

	while (!el.classList.contains('chart-wrap')) {
		el = el.parentNode;
	}

	return el;
}

function reprint (ev) {
	ev.preventDefault();
	const container = getChartContainer(ev.target);
	const configure = getConfigurator(container.querySelector('.chart__configurator'), ev.target.name);
	if (!configure) {
		return;
	}
	const chartName = container.querySelector('.chart').dataset.chartName;
	const kq = configure(retrieveKq(chartName));
	buildChartLinks(kq, container);

	// Todo: Add an attribute to signify this chart has been deliberately configured by
	// the user (and therefore should not be reprinted when dashboard chart UI is changed)
	renderChart(container.querySelector('.chart__printer'), kq, window.charts.find(c => c.name === chartName));
}

function buildChartLinks (kq, chartEl) {
	const explorerLink = chartEl.querySelector('.chart__ui__explorer-link');
	const wizardLink = chartEl.querySelector('.chart__ui__wizard-link');
	if (explorerLink) {
		explorerLink.href = kq.generateKeenUrl('/data/explorer?', 'explorer');
	}

	if (wizardLink) {
		wizardLink.href = `/data/query-wizard?query=${encodeURIComponent(kq.toString().replace('->print(LineChart)', ''))}`
	}
}

function buildAllChartLinks () {
	[].forEach.call(document.querySelectorAll('.chart'), chartEl => {
		const chartName = chartEl.dataset.chartName;
		const kq = retrieveKq(chartName);
		if (!kq) {
			return;
		}
		if (kq.dimension > 1) {
			chartEl.classList.add('chart--pre-grouped')
		}
		buildChartLinks(kq, chartEl);
	});
}

export function init (container) {
	const del = new Delegate(container);
	del.on('change', '.chart__configurator [name]', reprint);
	del.on('click', '.chart__ui__copy-data', copyData);
	buildAllChartLinks();
}

