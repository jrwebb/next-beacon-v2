
function getTimeframe(form, updatedField) {
	const relTimeEl = form.querySelector('[name="timeframe"]:checked')
	const relTime = relTimeEl && relTimeEl.value;
	const startEl = form.querySelector('[name="timeframe[start]"]');
	const endEl = form.querySelector('[name="timeframe[end]"]');
	const absTime = {
		start: startEl.value,
		end: endEl.value
	};

	// fully set absolute time
	if (absTime.start && absTime.end && updatedField !== 'timeframe') {
		relTimeEl && relTimeEl.removeAttribute('checked');
		return absTime;
	// midway through setting absolute time
	} else if (/^timeframe\[(start|end)\]$/.test(updatedField)) {
		return null;
	// otherwise fallback to relative time range
	} else {
		endEl.value = '';
		startEl.value = '';
		if (!relTime) {
			form.querySelector('[name="timeframe"][value="this_14_days"]').setAttribute('checked', '');
			return 'this_14_days';
		}
		return relTime;
	}
}

function getFilters (form) {
	return [].map.call(form.querySelectorAll('.chart-configurator__filter'), el => {
		return {
			prop: el.name,
			value: el.querySelector('option:checked') && el.querySelector('option:checked').value
		}
	})
		.filter(o => o.value);
}

export function getFormState (form, updatedField) {
	return {
		timeframe: getTimeframe(form, updatedField),
		interval: form.querySelector('[name="interval"]').value,
		printer: form.querySelector('[name="printer"]:checked').value,
		group: form.querySelector('[name="group"]:checked') && form.querySelector('[name="group"]:checked').value,
		filters: getFilters(form)
	}
}
