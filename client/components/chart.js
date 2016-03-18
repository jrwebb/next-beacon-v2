import KeenQuery from 'keen-query';
import {storeKq} from '../data/kq-cache';
import {fromQueryString as getConfiguratorFromQueryString} from './configurator';

const rendererMap = new WeakMap();
const chartsMap = new WeakMap();

function finishRender (printerEl, chartConfig) {
	chartsMap.set(printerEl, chartConfig);
	printerEl.classList.remove('chart--loading');
	printerEl.classList.add('chart--loaded');
}

export function displayError (printerEl, err, kq, chartConfig) {
	console.log('Error', err, kq, chartConfig);
	printerEl.classList.remove('chart--loading');
	printerEl.classList.add('chart-error');
	printerEl.innerHTML = `<p class="error"><strong>Error: </strong>${err.message || err}</span><p>${chartConfig.name}, ${chartConfig.label}, ${chartConfig.question}: ${chartConfig.query}</p>`;
}

export function renderChart (printerEl, builtQuery, chartConfig) {
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
					let chartConfig = chartsMap.get(printerEl);
					// avoid google charts related memory leaks
					if (chartConfig) {
						chartConfig.clearChart();
					}
					const rendererResult = renderer(printerEl, chartConfig);

					if (rendererResult && rendererResult.then) {
						return rendererResult.then(chartConfig => {
							finishRender(printerEl, chartConfig);
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

		storeKq(`${chartConfig.name}:printed`, builtQuery);
	} catch (err) {
		renderPromise = Promise.reject(err)
	}

	rendererMap.set(printerEl, renderPromise)

	renderPromise.catch(err => {
		// avoid race condition when clicking multiple configurator buttons in quick succession
		if (rendererMap.get(printerEl) !== renderPromise) {
			return;
		}
		displayError(printerEl, err, builtQuery, chartConfig);
	});
}

export function buildAndRenderChart (chartConfig, printerEl) {
	try {
		let builtQuery = KeenQuery.buildFromAlias(chartConfig);

		// todo: default to column chart if it has dimension but no interval... or something
		builtQuery = builtQuery.setPrinter(chartConfig.printer || 'LineChart').tidy();

		if (chartConfig.hasConfigurableInterval) {
			// avoid showing as big number when the default view could easily be converted to a line graph over time
			if (builtQuery.dimension < 2 && (['AreaChart','LineChart','ColumnChart'].indexOf(chartConfig.printer) > -1 || !chartConfig.printer)) {
				builtQuery = builtQuery.interval('d')
			}
		}

		storeKq(chartConfig.name, builtQuery);

		const configuratorSkipSteps = [];

		if (!chartConfig.hasConfigurableInterval) {
			configuratorSkipSteps.push('interval');
		}

		if (!chartConfig.hasConfigurableTimeframe) {
			configuratorSkipSteps.push('timeframe');
		}

		const configure = getConfiguratorFromQueryString();
		builtQuery = configure(builtQuery, configuratorSkipSteps);
		renderChart(printerEl, builtQuery, chartConfig);
	} catch (err) {
		displayError(printerEl, err, null, chartConfig);
	}
}

