import {colors} from './colors';

export const supportedChartTypes = ['LineChart','PieChart','BarChart','ColumnChart','AreaChart','SteppedAreaChart','Table'];

const axisStyle = {
	color: '#222',
	fontName: 'HelveticaNeue-Light',
	fontSize: 16,
	bold: false,
	italic: false
};

export const defaultChartOptions = {
	width: '100%',
	height: '100%',
	is3D: true,
	pieSliceTextStyle: {
		color: 'black'
	},
	curveType:'function',
	chartArea: {
		top: '10%',
		left: '8%',
		width: '95%',
		height: '75%'
	},
	vAxis: {
		viewWindow: { min: 0 },
		format: 'short',
		titleTextStyle: axisStyle
	},
	hAxis: {
		gridlines: {
			count: 8,
			color: '#F7F7F7'
		},
		titleTextStyle: axisStyle
	},
	pointSize: 5,
	pointShape: 'circle',
	colors: colors,

	// janky !!
	// animation: {
	// 	startup: true,
	// 	duration: 500
	// }
};
