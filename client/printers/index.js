import KeenQuery from 'n-keen-query';
import {supportedChartTypes} from '../config/google-chart';
import {googleChartPrinterFactory} from './google-charts';
import {printer as bigNumber} from './big-number';

supportedChartTypes.forEach(chartType => KeenQuery.definePrinter(chartType, googleChartPrinterFactory(chartType)))

KeenQuery.definePrinter('big-number', bigNumber);
