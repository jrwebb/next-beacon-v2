'use strict';

const KeenQuery = require('n-keen-query');
const Botkit = require('botkit');
const controller = Botkit.slackbot();
const processBotCommand = require('./lib/process-bot-command');


const bot = controller.spawn({
  token: process.env.SLACK_KEENBOT_TOKEN
});

const generateResponse = (results) => {
	return {
		attachments: [
		{
      fallback: "Complete",
      title: results.question,
      color: "#7CD197",
      fields: results.headings.map((heading, index) => {
      	return {
      		title: heading,
      		value: results.rows[index].join(' | '),
      		short: false
      	};
    	})
  	}]
	}
};


bot.startRTM(function(err) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

const convertToQuery = (message) => message.replace(/\&gt;/g, '>');

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
	return KeenQuery.buildFromAlias(query).print().then((res) => {
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
