import Delegate from 'dom-delegate';

function handleRangeChange () {
	const slider = document.querySelector('.extract__numberOfEvents-range');
	const output = document.querySelector('.extract__numberOfEvents');

	if (slider && output) {
		output.value = slider.value;
	}
}

export function init () {
	const delegate = new Delegate(document.body);
	delegate.on('change', '.extract__numberOfEvents-range', handleRangeChange);
}
