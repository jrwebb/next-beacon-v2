
import {getCoreChartTypes} from '../google-chart'
import KeenQuery from 'n-keen-query'

KeenQuery.definePrinter('html', require('./html'))

// All core google charts use the same printer.
const coreChartTypes = getCoreChartTypes()
coreChartTypes.forEach(e => KeenQuery.definePrinter(e, require('./core')))
