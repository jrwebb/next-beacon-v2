'use strict';

// http://styleguide.ft.com/#colour-palette
const colors = [
	// {name:'Green', hex : '#09a25c'},
	{name:'Light Green', hex : '#a1dbb2'},
	// {name:'Red', hex : '#cc0033'},
	// {name:'Purple', hex : '#92288f'},
	{name:'Light Purple', hex : '#ebcaec'},
	// {name:'Blue', hex : '#0e6dcc'},
	{name:'Light Blue', hex : '#c5d4e8'},
	{name:'Pink tint 1', hex : '#f6e9d8'},
	// {name:'Pink tint 2', hex : '#e9decf'},
	{name:'Pink tint 3', hex : '#cec6b9'},
	// {name:'Pink tint 4', hex : '#a7a59b'},
	// {name:'Pink tint 5', hex : '#74736c'}
]

module.exports = {
	getColors : () => colors.map(x => x.hex)
}
