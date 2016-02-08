import Delegate from 'dom-delegate';
import {retrieveKq, storeKq} from '../data/kq-cache';
import {fromForm as getConfigurator} from '../components/configurator';

function getChartContainer (el) {
	while (!el.classList.contains('chart')) {
		el = el.parentNode;
	}
	return el;
}

export function renderChart (printerEl, kq, meta) {
	try {
		kq.print()
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
		storeKq(`${meta.name}:printed`, kq);
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

	del.on('change', '.chart__configurator [name]', reprint);
	del.on('click', '.chart-configurator__copy-data', copyData);

	[].forEach.call(container.querySelectorAll('.chart'), chartEl => {
		const uiEl = chartEl.querySelector('.chart__ui');
		if (!uiEl) return;

		const alias = chartEl.dataset.keenAlias;
		const kq = retrieveKq(alias);
		if (kq.dimension > 1) {
			chartEl.classList.add('chart--pre-grouped')
		}

		uiEl.insertAdjacentHTML('beforeend', `<a href="${retrieveKq(chartEl.dataset.keenAlias).generateKeenUrl('/data/explorer?', 'keen-explorer')}">
			View in keen explorer
		</a>`);
	});
}

