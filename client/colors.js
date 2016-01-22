'use strict';

// http://styleguide.ft.com/#colour-palette
// https://github.com/Financial-Times/o-colors/blob/master/src/scss/_palette.scss
const colors = [
	{ name:'Light Blue', hex:'#c5d4e8' },
	{ name:'Light Green', hex:'#a1dbb2' },
	{ name:'Light Purple', hex:'#ebcaec' },
	{ name:'Pink tint 1', hex:'#f6e9d8' },
	{ name:'Pink tint 2', hex:'#e9decf' },
	{ name:'Pink tint 3', hex:'#cec6b9' },
	{ name:'Pink tint 4', hex:'#a7a59b' },
	{ name:'Pink tint 5', hex:'#74736c' },
	{ name:'blue-tint1', hex:'#598caf' },
	{ name:'blue-tint2', hex:'#75a5c2' },
	{ name:'blue-tint3', hex:'#8ab5cd' },
	{ name:'blue-tint4', hex:'#a9cadc' },
	{ name:'blue-tint5', hex:'#bcd7e5' },
	{ name:'warm-1', hex:'#ffe9d7' },
	{ name:'warm-2', hex:'#f6e9d8' },
	{ name:'warm-3', hex:'#cec6b9' },
	{ name:'warm-4', hex:'#1d1d1d' },
	{ name:'warm-5', hex:'#fdf8f2' },
	{ name:'warm-6', hex:'#8b572a' },
	{ name:'orange-tint1', hex:'#eda45e' },
	{ name:'brown-tint1', hex:'#94826b' },
	{ name:'yellow-tint1', hex:'#eed485' },
	{ name:'green-tint1', hex:'#a6a471' },
	{ name:'bluegreen-tint1', hex:'#819e9a' },
	{ name:'silver-tint1', hex:'#c1b8b4' },
	{ name:'purple-tint1', hex:'#936971' },
	{ name:'purple-tint2', hex:'#737e7e' },
	{ name:'red-tint1', hex:'#b1493f' },
	{ name:'red-tint2', hex:'#c36256' },
	{ name:'red-tint3', hex:'#d17c70' },
	{ name:'red-tint4', hex:'#df9c92' },
	{ name:'red-tint5', hex:'#ebbcb3' },
	{ name:'Green', hex:'#09a25c' },
	{ name:'Red', hex:'#cc0033' },
	{ name:'Purple', hex:'#92288f' },
	{ name:'Blue', hex:'#0e6dcc' },
	{ name:'Grey tint 1', hex:'#b0b0b0' },
]

module.exports = {
	getColors : () => colors.map(x => x.hex)
}
