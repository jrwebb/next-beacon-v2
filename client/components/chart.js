import KeenQuery from 'keen-query';
import {storeKq} from '../data/kq-cache';
import {fromQueryString as getConfiguratorFromQueryString} from './configurator';

const rendererMap = new WeakMap();
const chartsMap = new WeakMap();

function finishRender (printerEl, chart) {
	chartsMap.set(printerEl, chart);
	printerEl.classList.remove('chart--loading');
	printerEl.classList.add('chart--loaded');

	// Todo: Trigger an update of the chart UI form (to reflect the properties of the built query)
}

export function displayError (printerEl, err, kq, meta) {
	console.log('Error', err, kq, meta);
	printerEl.classList.remove('chart--loading');
	printerEl.classList.add('chart-error');
	printerEl.innerHTML = `<p class="error"><strong>Error: </strong>${err.message || err}</span><p>${meta.name}, ${meta.label}, ${meta.question}: ${meta.query}</p>`;
}

export function renderChart (printerEl, builtQuery, chart) {
	let renderPromise;
	printerEl.classList.add('chart--loading');
	try {

		renderPromise = builtQuery.print()
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
					const rendererResult = renderer(printerEl, chart);

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
		storeKq(`${chart.name}:printed`, builtQuery);
	} catch (err) {
		renderPromise = Promise.reject(err)
	}

	rendererMap.set(printerEl, renderPromise)

	renderPromise.catch(err => {
		// avoid race condition when clicking multiple configurator buttons in quick succession
		if (rendererMap.get(printerEl) !== renderPromise) {
			return;
		}
		displayError(printerEl, err, builtQuery, chart);
	});
}

export function buildAndRenderChart (chart, printerEl) {
	try {
		let builtQuery = KeenQuery.buildFromAlias(chart);

		// todo: default to column chart if it has dimension but no interval... or something
		builtQuery = builtQuery.setPrinter(chart.printer || 'LineChart').tidy();

		if (chart.hasConfigurableInterval) {
			// avoid showing as big number when the default view could easily be converted to a line graph over time
			if (builtQuery.dimension < 2 && (['AreaChart','LineChart','ColumnChart'].indexOf(chart.printer) > -1 || !chart.printer)) {
				builtQuery = builtQuery.interval('d')
			}
		}

		storeKq(chart.name, builtQuery);

		const configuratorSkipSteps = [];

		if (!chart.hasConfigurableInterval) {
			configuratorSkipSteps.push('interval');
		}

		if (!chart.hasConfigurableTimeframe) {
			configuratorSkipSteps.push('timeframe');
		}

		const configure = getConfiguratorFromQueryString();
		builtQuery = configure(builtQuery, configuratorSkipSteps);
		renderChart(printerEl, builtQuery, chart);
	} catch (err) {
		displayError(printerEl, err, null, chart);
	}
}

