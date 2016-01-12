/* global Chart */

'use strict';

// http://next.ft.com/__styleguide/design-primitives#palette
const colors = {
	'chartjs-1' : '151,187,205',
	'chartjs-2' : '220,220,220',
	'warm-3': '206,198,185', //#cec6b9
	'warm-6': '139,87,42', //#8b572a
	'cold-1': '80,80,80', //#505050
	'cold-3': '29,29,29', //#1d1d1d
	'blue-1': '0,39,88', //#002758
	'purple-1': '65,0,87', //#410057
	'teal-1': '39,117,123', //#27757b
	'teal-2': '43,187,191', //#2bbbbf
	'claret-1': '158,47,80', //#9e2f50
	'claret-2': '255,127,138' //#ff7f8a
}
let usedColors = [];

// Return the RGB for the requested (or a random) color
module.exports.getColor = function(colorName) {
	if (colorName && colors[colorName]) {
		usedColors.push(colorName);
		return colors[colorName];
	} else {
		let color;
		let candidates = Object.keys(colors);
		if (usedColors.length < colors.length) {
			candidates = candidates.filter((item) => !usedColors.includes(item));
		}
		color = candidates[Math.floor(Math.random() * candidates.length)];
		usedColors.push(color);
		return colors[color];
	}
}
