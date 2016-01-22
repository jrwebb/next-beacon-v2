
const KeenQuery = require('n-keen-query');

KeenQuery.definePrinter('html', require('./html'));
KeenQuery.definePrinter('line', require('./core'));
KeenQuery.definePrinter('bar', require('./core'));
KeenQuery.definePrinter('column', require('./core'));
KeenQuery.definePrinter('pie', require('./core'));
