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
	const rows = table.headings ? [table.headings] : []
	return rows.concat(table.rows)
			.map(row => row.join('\t'))
			.join('\n');
}

// Todo: handle absolute timeframes
KeenQuery.buildFromAlias = (alias) => {
	let query = alias.query;
	query += typeof alias.timeframe === 'string' ? `->relTime(${alias.timeframe})` : '';
	query += typeof alias.interval === 'string' ? `->interval(${alias.interval})` : '';
	return KeenQuery.build(query);
}

KeenQuery.generateExplorerUrl = (builtQuery) => {
	console.log('KeenQuery.generateExplorerUrl() is deprecated');
	return builtQuery.generateKeenUrl('/data/explorer?','explorer');
}


// define printers
supportedChartTypes.forEach(chartType => KeenQuery.definePrinter(chartType, googleChartPrinterFactory(chartType)))

KeenQuery.definePrinter('big-number', bigNumber);

KeenQuery.definePrinter('TSV', function () {
	return (el) => {
		el.innerHTML = `<pre>${this.toTSV()}</pre>`;
	}
});

KeenQuery.definePrinter('YML', function () {
	return (el) => {
		el.innerHTML = `<pre>You ask too much! YAML printer will be ready soon :-)</pre>`;
	}
});
