import Delegate from 'dom-delegate';
import {retrieveKq, storeKq} from '../data/kq-cache';
import {fromForm as getConfigurator} from '../components/configurator';
import oExpander from 'o-expander';

const rendererMap = new WeakMap();


function getChartContainer (el) {
	while (!el.classList.contains('chart')) {
		el = el.parentNode;
	}
	return el;
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
				printerEl.classList.remove('chart--loading');
				printerEl.classList.add('chart--loaded');
				if (typeof renderer === 'function') {
					renderer(printerEl, meta);
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
		console.log('Error', err, kq, meta);
		printerEl.classList.remove('chart--loading');
		printerEl.classList.add('chart-error');
		printerEl.innerHTML = `<p class="error"><strong>Error: </strong>${err.message || err}</span><p>${meta.name}, ${meta.label}, ${meta.question}: ${meta.query}</p>`;
	});
}

function reprint (ev) {
	ev.preventDefault();
	const container = getChartContainer(ev.target);
	const configure = getConfigurator(container.querySelector('.chart__configurator'), ev.target.name);
	const alias = container.dataset.keenAlias;
	const kq = configure(retrieveKq(alias));
	renderChart(container.querySelector('.chart__printer'), kq, window.aliases[alias]);
}

function copyData (ev) {
	ev.preventDefault();
	const container = getChartContainer(ev.target);
	const alias = container.dataset.keenAlias;
	const kq = retrieveKq(`${alias}:printed`);

	const copyTextarea = document.createElement('textarea');

	copyTextarea.textContent = kq.toTSV();
	container.appendChild(copyTextarea);
	copyTextarea.select();

	try {
		document.execCommand('copy');
		container.removeChild(copyTextarea);
	} catch (err) {
		container.removeChild(copyTextarea);
		alert('Oops, unable to copy');
	}
}

// Utilities for user interface (ui) elements
export function init (container) {
	const del = new Delegate(container);
	oExpander.init(container);
	del.on('change', '.chart__configurator [name]', reprint);
	del.on('click', '.chart__ui__copy-data', copyData);

	[].forEach.call(container.querySelectorAll('.chart'), chartEl => {
		const uiEl = chartEl.querySelector('.chart__ui');
		if (!uiEl) return;

		const alias = chartEl.dataset.keenAlias;
		const kq = retrieveKq(alias);
		if (kq.dimension > 1) {
			chartEl.classList.add('chart--pre-grouped')
		}

		uiEl.querySelector('.chart__ui__links').insertAdjacentHTML('beforeend', `<a href="${retrieveKq(chartEl.dataset.keenAlias).generateKeenUrl('/data/explorer?', 'explorer')}">View in keen explorer</a>`);

		uiEl.querySelector('.chart__ui__links').insertAdjacentHTML('beforeend', `<a href="/data/query-wizard?query=${window.aliases[alias].query}">View in query wizard</a>`);
	});
}

