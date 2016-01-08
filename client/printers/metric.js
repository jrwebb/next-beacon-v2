'use strict';

module.exports = function (keenAPIresponse) {
	return function (el){
		console.log('metric',el,keenAPIresponse);
	}
}
