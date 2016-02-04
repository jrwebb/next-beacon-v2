
function getTimeframe(container, type) {
	const relTimeEl = container.querySelector('[name="timeframe"]:checked')
	const relTime = relTimeEl && relTimeEl.value;
	const startEl = container.querySelector('.chart__configurator__start');
	const endEl = container.querySelector('.chart__configurator__end');
	const absTime = {
		start: startEl.value,
		end: endEl.value
	};

	// fully set absolute time
	if (absTime.start && absTime.end && type !== 'rel') {
		relTimeEl && relTimeEl.removeAttribute('checked');
		return absTime;
	// midway through setting absolute time
	} else if (type === 'abs') {
		return null;
	// otherwise fallback to relative time range
	} else {
		endEl.value = '';
		startEl.value = '';
		if (!relTime) {
			container.querySelector('.chart__configurator__timeframe[value="this_14_days"]').setAttribute('checked', '');
			return 'this_14_days';
		}
		return relTime;
	}

}




	// del.on('change', '.chart__configurator__interval', function (ev) {
	// 	ev.preventDefault();
	// 	const container = getChartContainer(ev.target);
	// 	reprint(container, {
	// 		timeframe: getTimeframe(container),
	// 		interval: container.querySelector('.chart__configurator__interval').value
	// 	});
	// });

	// del.on('change', '.chart__configurator [name^="timeframe"]', function (ev) {
	// 	ev.preventDefault();
	// 	const type = ev.target.name === 'timeframe' ? 'rel' : 'abs';
	// 	const container = getChartContainer(ev.target);
	// 	const timeframe = getTimeframe(container, type);
	// 	if (!timeframe) {
	// 		return;
	// 	}
	// 	reprint(container, {
	// 		timeframe: getTimeframe(container, type),
	// 		interval: container.querySelector('.chart__configurator__interval').value
	// 	});
	// });

	// del.on('click', '.chart__view-switcher', function (ev) {
	// 	ev.preventDefault();
	// 	let asData;
	// 	const container = getChartContainer(ev.target);
	// 	if (ev.target.hasAttribute('aria-pressed')) {
	// 		asData = false;
	// 		ev.target.removeAttribute('aria-pressed');
	// 	} else {
	// 		asData = true
	// 		ev.target.setAttribute('aria-pressed', '');
	// 	}
	// 	reprint(container, {
	// 		timeframe: getTimeframe(container),
	// 		interval: container.querySelector('.chart__configurator__interval').value,
	// 		asData
	// 	});
	// });


export function getFormState (form, updateEl) {

}
