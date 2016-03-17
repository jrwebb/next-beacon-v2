const el = document.querySelector('.dashboard__configurator__form');
el.addEventListener('change', (e) => {
	if (e.preventDefault) e.preventDefault();
	const form = e.currentTarget;
	const timeframeValue = form.querySelector('.timeframe').value;
	let querystring = '?' + timeframeValue;

	// Todo: Tell the charts to update and reprint themselves (based on querystring perhaps?)
	// [].forEach.call(document.querySelectorAll('.chart .chart__configurator [name]'), chartEl => {
	// 	//del.on('change', '.chart__configurator [name]', reprint);
	// 	console.log(chartEl);
	// 	chartEl.dispatchEvent(new Event('change'));
	// });

	// history.pushState({}, "", querystring);
	window.location = querystring;

	return false;
});
