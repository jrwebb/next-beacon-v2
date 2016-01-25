(() => {
	const el = document.querySelector('.feature-search');
	el.addEventListener('submit', (e) => {
		if (e.preventDefault) e.preventDefault();
		window.location = "/feature/" + document.querySelector('.featureFlagText').value;
		return false;
	});
})();
