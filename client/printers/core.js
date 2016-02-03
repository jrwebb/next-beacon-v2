/* global google */

'use strict';

import googleChart from '../google-chart';
import html from './html';

function hasDimension (kq) {
	return kq.getTable().dimension;
}

// Todo: Figure out why converting this to es6 breaks it. (`this` becomes `undefined`, but why?)
// This breaks it: `module.exports = () => {`
module.exports = function () {
	return (el, alias, printer) => {
		if (hasDimension(this)) {
			const googleOnLoadCallback = () => {
				const dataTable = googleChart.getDataTable(alias, this, printer);
				googleChart.drawChart(alias, el, dataTable, printer);
			}
			google.charts.setOnLoadCallback(googleOnLoadCallback.bind(this, alias, el));
		} else {
			return html.call(this)(el, alias);
		}

	}
}
