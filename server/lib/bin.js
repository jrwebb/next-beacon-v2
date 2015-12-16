'use strict';
console.log(process.env);
var TerseQuery = require('./terse-query');

var q = process.argv[2];

if (!/->print\(/.test(q)) {
	q = q + '->print(ascii)';
}

TerseQuery.parse(q);
