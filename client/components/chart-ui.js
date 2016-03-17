import Delegate from 'dom-delegate';
import {retrieveKq, storeKq} from '../data/kq-cache';
import {fromForm as getConfigurator} from '../components/configurator';
import oExpander from 'o-expander';

const rendererMap = new WeakMap();
const chartsMap = new WeakMap();

function getChartContainer (el) {
	while (!el.classList.contains('chart')) {
		el = el.parentNode;
	}
	return el;
}

function finishRender (printerEl, chart) {
	chartsMap.set(printerEl, chart);
	printerEl.classList.remove('chart--loading');
	printerEl.classList.add('chart--loaded');
}

export function renderChart (printerEl, kq, meta) {

	let renderPromise;
	printerEl.classList.add('chart--loading');
	try {

		renderPromise = kq.print()
			.then(renderer => {
				// avoid race condition when clicking multiple configurator buttons in quick succession
				if (rendererMap.get(printerEl) !== renderPromise) {
					return;
				}

				if (typeof renderer === 'function') {
					let chart = chartsMap.get(printerEl);
					// avoid google charts related memory leaks
					if (chart) {
						chart.clearChart();
					}
					const rendererResult = renderer(printerEl, meta);

					if (rendererResult && rendererResult.then) {
						return rendererResult.then(chart => {
							finishRender(printerEl, chart);
						});
					} else {
						finishRender(printerEl, rendererResult)
						return rendererResult;
					}

				} else {
					printerEl.classList.add('chart-error');
					throw 'Keen query did not return printable output.'
				}
			});
		storeKq(`${meta.name}:printed`, kq);
	} catch (err) {
		renderPromise = Promise.reject(err)
	}

	rendererMap.set(printerEl, renderPromise)

	renderPromise.catch(err => {
		// avoid race condition when clicking multiple configurator buttons in quick succession
		if (rendererMap.get(printerEl) !== renderPromise) {
			return;
		}
		displayError(printerEl, err, kq, meta);
	});
}

export function displayError (printerEl, err, kq, meta) {
	console.log('Error', err, kq, meta);
	printerEl.classList.remove('chart--loading');
	printerEl.classList.add('chart-error');
	printerEl.innerHTML = `<p class="error"><strong>Error: </strong>${err.message || err}</span><p>${meta.name}, ${meta.label}, ${meta.question}: ${meta.query}</p>`;
}

function reprint (ev) {
	ev.preventDefault();
	const container = getChartContainer(ev.target);
	const configure = getConfigurator(container.querySelector('.chart__configurator'), ev.target.name);
	if (!configure) {
		return;
	}
	const chartName = container.dataset.chartName;
	const kq = configure(retrieveKq(chartName));
	buildChartLinks(kq, container);
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

export function init (container) {
	oExpander.init(container);

	const del = new Delegate(container);
	del.on('change', '.chart__configurator [name]', reprint);
	del.on('click', '.chart__ui__copy-data', copyData);

	[].forEach.call(container.querySelectorAll('.chart'), chartEl => {
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

