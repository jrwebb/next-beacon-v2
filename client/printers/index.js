
const KeenQuery = require('n-keen-query');

KeenQuery.definePrinter('line', require('./line'));
KeenQuery.definePrinter('html', require('./html'));
KeenQuery.definePrinter('pie', require('./pie'));
