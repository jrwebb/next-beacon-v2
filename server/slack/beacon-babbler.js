'use strict';

const Botkit = require('botkit');
const controller = Botkit.slackbot();

// "Beacon Babbler" is a slack bot (https://financialtimes.slack.com/messages/@beacon)
const slackbot = controller.spawn({
	token: process.env.SLACK_BOT_TOKEN
});

slackbot.startRTM(function(err) {
	if (err) {
		throw new Error('Could not connect to Slack');
	}
});

controller.hears(['(.*)'],["direct_message","direct_mention","mention"], (slackbot, message) => {
	slackbot.reply(message, "Hello")
});
