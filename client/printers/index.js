import {supportedChartTypes} from '../config/google-chart';
import {googleChartPrinterFactory} from './google-charts';
import {printer as bigNumber} from './big-number';
import KeenQuery from 'keen-query';

// Used to generate Tab separated values for copy paste
// Can't use definePrinter here as the printer API is promisey
// which conflicts with browseres' strict conditions for when
// the document.execCommand('copy') API is allowed.
KeenQuery.prototype.toTSV = KeenQuery.Aggregator.prototype.toTSV = function () {
	const table = this.getTable().humanize('human');
	return [table.headings].concat(table.rows)
		.map(row => row.join('\t'))
		.join('\n');
}

// Todo: handle absolute timeframes
KeenQuery.buildFromAlias = (alias) => {
	let query = alias.query;
	query += alias.timeframe ? `->relTime(${alias.timeframe})` : '';
	query += alias.interval ? `->interval(${alias.interval})` : '';
	return KeenQuery.build(query);
}

KeenQuery.generateExplorerUrl = (builtQuery) => {
	console.log('KeenQuery.generateExplorerUrl() is deprecated');
	return builtQuery.generateKeenUrl('');
}

// exclude staff by default
KeenQuery.forceQuery(function () {
	this.filter('user.isStaff=false');
});

// define printers
supportedChartTypes.forEach(chartType => KeenQuery.definePrinter(chartType, googleChartPrinterFactory(chartType)))

KeenQuery.definePrinter('big-number', bigNumber);

// define some shortcut queries
KeenQuery.defineQuery('anon', function () {
	return this.filter('!user.uuid');
});

KeenQuery.defineQuery('subs', function () {
	return this.filter('user.uuid');
});

KeenQuery.defineQuery('myft', function (n) {
	return this.filter(`user.myft.following>${n || 0}`);
});
