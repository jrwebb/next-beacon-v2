'use strict';
let aliases = [];
const Poller = require('ft-poller');
const fs = require('fs');
const denodeify = require('denodeify');
const readFile = denodeify(fs.readFile);
const writeFile = denodeify(fs.writeFile);
const url = 'http://bertha.ig.ft.com/view/publish/gss/1jH15yE5T6omD-B58UJfu1y4j8qN4QIs17u-52_Jkw7M/aliases';

const poller = new Poller({
	url: url,
	defaultData: [],
	parseData: function (json) {
		aliases = json;
		return json
	}
});

function update () {
	// Always update from Bertha
	const update = fetch(url)
		.then(res => res.json())
		.then(json => {
			writeFile(`${process.env.HOME}/.kq-aliases`, JSON.stringify(json, null, '\t'))
			return json
		});
	// If local cache exists use it, otherwise wait for bertha
	return readFile(`${process.env.HOME}/.kq-aliases`, 'utf8')
		.then(file => {
			return JSON.parse(file);
		}, () => {
			return update;
		})
}

update();

module.exports = {
	get: name => {
		if (name) {
			return aliases.filter(a => a.name && a.name.indexOf(name) === 0);
		} else {
			return aliases;
		}
	},
	poll: () => poller.start({initialRequest: true}),
	update: () => update()
};


