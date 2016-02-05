import humanize from 'humanize-plus';
import {getDefaultMeta} from './util';

export function renderBigNumber (el, kq, meta) {
	let html = `<div class="o-big-number o-big-number--standard" title="${meta.question}">`

	if (meta.question) {
		html += `<div class="o-big-number__content o-big-number__content--question chart-question">${meta.question}</div>`;
	}

	const niceNumber = humanize.compactInteger(kq.getTable().data, 1);
	html += `<div class="o-big-number__title chart-data">${niceNumber}</div>`;

	if (meta.label) {
		html += `<div class="o-big-number__content chart-label">${meta.label}</div>`;
	}

	el.innerHTML = html + `</div>`;
}


export function printer () {
	return (el, meta) => {
		meta = meta || getDefaultMeta();
		return renderBigNumber(el, this, meta);
	}
}
