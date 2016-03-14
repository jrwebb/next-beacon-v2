import numeral from 'numeral';
import {getDefaultMeta} from './util';

export function renderBigNumber (el, kq, meta) {
	let html = `<div class="o-big-number o-big-number--standard" title="${meta.question}">`

	// Todo: Add support for percentages; i.e. format('0%')
	let niceNumber;
	if(kq.getTable().data >= 1000) {
		niceNumber = numeral(kq.getTable().data).format('0.0a');
	} else {
		niceNumber = Math.round(kq.getTable().data * 10)/10;
	}

	html += `<div class="o-big-number__title chart-data">${niceNumber}</div>`;

	if (meta.datalabel) {
		html += `<div class="o-big-number__content chart-label">${meta.datalabel}</div>`;
	}

	el.innerHTML = html + `</div>`;
	const bigNumberEl = el.querySelector('.o-big-number__title');
	const bigNumberTextWidth = bigNumberEl.scrollWidth;
	const bigNumberContainerWidth = bigNumberEl.clientWidth;
	if (bigNumberTextWidth > bigNumberContainerWidth) {
		const bigNumberFontSize = parseInt(getComputedStyle(bigNumberEl).getPropertyValue('font-size'), 10);
		bigNumberEl.style.fontSize = (bigNumberFontSize * bigNumberContainerWidth / bigNumberTextWidth ) + 'px';
	}
}


export function printer () {
	return (el, meta) => {
		meta = meta || getDefaultMeta();
		return renderBigNumber(el, this, meta);
	}
}
