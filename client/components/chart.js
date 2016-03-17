import {storeKq} from '../data/kq-cache';

const rendererMap = new WeakMap();
const chartsMap = new WeakMap();

function finishRender (printerEl, chart) {
	chartsMap.set(printerEl, chart);
	printerEl.classList.remove('chart--loading');
	printerEl.classList.add('chart--loaded');
}

export function displayError (printerEl, err, kq, meta) {
	console.log('Error', err, kq, meta);
	printerEl.classList.remove('chart--loading');
	printerEl.classList.add('chart-error');
	printerEl.innerHTML = `<p class="error"><strong>Error: </strong>${err.message || err}</span><p>${meta.name}, ${meta.label}, ${meta.question}: ${meta.query}</p>`;
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


