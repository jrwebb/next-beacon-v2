'use strict';

const KeenQuery = require('n-keen-query');
const Botkit = require('botkit');
const controller = Botkit.slackbot();
const didyoumean = require('didyoumean');

let allQueries = [];
let questions = [];

//Get all queries and store the questions in an array for later lookup
KeenQuery.aliases.poll().then(() => {
	allQueries = KeenQuery.aliases.get('');
	questions = allQueries.map(q => q.question).filter(q => !!q);
});

const bot = controller.spawn({
  token: process.env.SLACK_KEENBOT_TOKEN
});

const generateResponse = (results) => ({
		attachments: [
		{
      fallback: "Complete",
      title: 'Results for ' + results.name,
      color: "#7CD197",
      fields: results.headings.map((heading, index) => {
      	return {
      		title: heading,
      		value: results.rows[index].reduce((prev, curr) => prev + curr + '|', ''),
      		short: false
      	};
    	})
  	}]
});


bot.startRTM(function(err,bot) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

const convertToQuery = (message) => message.replace(/\&gt;/g, '>');

controller.hears(['run (.*)'],["direct_message","direct_mention","mention"], (bot, message) => {
	const query = convertToQuery(message.match[1]);
	KeenQuery.build(query).print()
	.then(results => {
			bot.reply(message, generateResponse(results))
	});
});


controller.hears(['(.*)'],["direct_message","direct_mention","mention"], (bot, message) => {
	const q = message.match[0].trim();
	const question = didyoumean(q, questions) || q;

	const queries = allQueries.filter((query) => {
		return query.question && (query.question === question || query.name.indexOf(question) === 0);
	});
	if(!queries || queries.length === 0) {
		bot.reply(message, 'sorry, dont understand you');
	} else {
		bot.reply(message, `I will now run query for question ${question}`);
	}
	Promise.all(queries.filter(query => !!query.query).map(query => KeenQuery.build(query.query.split('->print')[0]).print()))
	.then(res => {
		res.forEach(results => {
			bot.reply(message, generateResponse(results))
		});
	})
	.catch(console.error);

});
