#!/usr/bin/env node
'use strict';

// extends keen-query prototype
const KeenQuery = require('../lib/with-aliases');
const cli = require('keen-query/lib/cli');

cli.init(function (program) {
	program
		.command('alias [name]')
		.option('--all', 'Run all matching aliases')
		.description('Converts an existing keen query into keen-query\'s format')
		.action(function(name, options) {
			KeenQuery.aliases.update()
				.then(arr => {
					if (!name) {
						console.log('Available aliases: \n\n' + arr.map(al => al.name).join('\n'));
						process.exit(0);
					} else {
						const alias = arr.find(al => al.name === name);
						if (alias) {
							cli.executeQuery(alias.query, alias.label)
						} else {
							const aliases = arr.filter(a => a.name && a.name.indexOf(name) === 0);
							if (options.all) {
								console.log('TODO: run all matching queries')
								process.exit(0);
							} else if (aliases.length > 1) {
								console.log('Multiple possible queries found (To run all these pass in the -a flag)')
								aliases.forEach(a => console.log(a.name));
								process.exit(0);
							} else if (aliases.length === 1) {
								console.log('Running closest matching query: ' + aliases[0].name)

								cli.executeQuery(aliases[0].query)
							} else {
								console.error('No matching aliases found');
								process.exit(1);
							}

						}

					}
				});
		});
});
