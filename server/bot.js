'use strict';

const KeenQuery = require('keen-query');
const Botkit = require('botkit');
const controller = Botkit.slackbot();
const processBotCommand = require('./lib/process-bot-command');

const bot = controller.spawn({
	token: process.env.SLACK_KEENBOT_TOKEN
});

KeenQuery.definePrinter('keenBot', function () {
	let table = this.getTable();

	// make sure the greatest dimension is shown vertically
	// TODO: base it on total text length rather than number of columns/rows
	if (table.dimension === 2) {
		const greatestDimension = table.size.reduce((max, s, i) => {
			if (s > this.getTable().size[max]) {
				return i;
			}
			return max;
		}, 0);
		table = table.switchDimensions(greatestDimension, 0, 'swap');
	}

	const data = table.humanize('shortest');

	return [{
		title: data.headings[0],
		value: data.headings.slice(1).join(' | '),
		short: false
	}].concat(data.rows.map(r => {
		return {
			title: r[0],
			value: r.slice(1).join(' | '),
			short: false
		};
	}))
})

const generateResponse = (results) => {
	return {
		attachments: [{
			fallback: "Complete",
			title: results.question,
			color: "#7CD197",
			fields: results
		}]
	}
};


bot.startRTM(function(err) {
	if (err) {
		throw new Error('Could not connect to Slack');
	}
});

const convertToQuery = (message) => message.replace(/\&gt;/g, '>')
	.replace(/->print\(.*\)$/, '') + '->print(\'keenBot\')';

controller.hears(['run (.*)'],["direct_message","direct_mention","mention"], (bot, message) => {
	const query = convertToQuery(message.match[1]);
	KeenQuery.execute(query)
	.then(results => {
			bot.reply(message, generateResponse(results))
	});
});

const askQuestion = (query, bot, message) => {
	if(!query.query) {
		bot.reply(message, 'There appears to be no query attached to that question...check the spreadsheet');
		return Promise.resolve();
	}
	return KeenQuery.buildFromAlias(query)
		.print('keenBot')
		.then((res) => {
			res.question = query.question || query.label || query.name;
			return res;
		});
}


controller.hears(['(.*)'],["direct_message","direct_mention","mention"], (bot, message) => {
	const q = message.match[0].trim();
	const queries = processBotCommand(q);

	if(!queries || queries.length === 0) {
		bot.reply(message, 'Sorry, I don\'t understand your question. You can add queries in the spreadsheet here: https://docs.google.com/spreadsheets/d/1jH15yE5T6omD-B58UJfu1y4j8qN4QIs17u-52_Jkw7M/edit#gid=0');
	}
	Promise.all(queries.map(query => askQuestion(query, bot, message)))
	.then(res => {
		res.forEach(results => {
			bot.reply(message, generateResponse(results))
		});
	})
	.catch((err) => {
		bot.reply(message, "Sorry, I couldn't answer your question :(: ```" + err + "```");
		console.error(err);
	});

});
