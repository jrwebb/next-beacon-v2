import KeenQuery from 'n-keen-query';
import {supportedChartTypes} from '../config/google-chart';
import {googleChartPrinterFactory} from './google-charts';
import {printer as bigNumber} from './big-number';

supportedChartTypes.forEach(chartType => KeenQuery.definePrinter(chartType, googleChartPrinterFactory(chartType)))

KeenQuery.definePrinter('big-number', bigNumber);

// Used to generate Tab separated values for copy paste
// Can't use definePrinter here as the printer API is promisey
// which conflicts with browseres' strict conditions for when
// the document.execCommand('copy') API is allowed.
KeenQuery.prototype.toTSV = function () {
	const table = this.getTable().humanize('human');
	return [table.headings].concat(table.rows)
		.map(row => row.join('\t'))
		.join('\n');
}
