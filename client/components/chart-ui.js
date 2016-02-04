import Delegate from 'dom-delegate';
import {storeKq, retrieveKq} from '../data/kq-cache';
import {fromForm as getConfigurator} from '../components/configurator';

function getChartContainer (el) {
	while (!el.classList.contains('chart')) {
		el = el.parentNode;
	}
	return el;
}

// function reprintold (container, opts) {
// 	const aliasName = container.dataset.keenAlias;
// 	const kq = kqObjects[aliasName];
// 	const printerEl = container.querySelector('.chart__printer')
// 	printerEl.classList.add('chart-loading');
// 	shakeAndBake(window.aliases[aliasName], getKqConfigurer(opts)(kq), printerEl, opts.asData ? 'Table' : null);
// }



export function printChart (printerEl, kq, meta) {
	try {

		kq
			.print()
			.then(renderer => {
				printerEl.classList.remove('chart-loading');
				printerEl.classList.add('chart-loaded');
				if (typeof renderer === 'function') {
					renderer(printerEl, meta);
				} else {
					printerEl.classList.add('chart-error');
					throw 'There is a problem with the keen-query response.'
				}
			});
	} catch (err) {
		console.log('err', meta);
		printerEl.classList.remove('chart-loading');
		printerEl.classList.add('chart-error');
		printerEl.innerHTML = `<p class="error"><strong>Error: </strong>${err.message || err}</span><p>${meta.name}, ${meta.label}, ${meta.question}: ${meta.query}</p>`;
	}
}

function reprint (ev) {
	ev.preventDefault();
	const container = getChartContainer(ev.target);
	const configure = getConfigurator(container.querySelector('.chart__configurator'), ev.target);
	const alias = container.dataset.keenAlias;
	const kq = configure(retrieveKq(alias));
	printChart(container.querySelector('.chart__printer'), kq, window.aliases[alias]);
}

// Utilities for user interface (ui) elements
export function init (container) {
	const del = new Delegate(container);

	del.on('change', '.chart__configurator__interval', reprint);

	del.on('change', '.chart__configurator [name^="timeframe"]', reprint);

	del.on('change', '.chart__view-switcher', reprint);

	[].forEach.call(container.querySelectorAll('.chart'), chartEl => {
		const uiEl = chartEl.querySelector('.chart__ui');
		if (!uiEl) return;

		uiEl.insertAdjacentHTML('beforeend', `<a href="${retrieveKq(chartEl.dataset.keenAlias).generateKeenUrl('/data/explorer?', 'keen-explorer')}">
			View in keen explorer
		</a>`);
	});
}

