'use strict';

// Todo: Replace this array with the questions from the dashboards in /dashboards/.
const messages = [
	"How many people have visited next ft today?",
	"Who's using next ft?",
	"When is next ft the busiest?",
	"What's the most popular section in next ft?",
	"Have you visited me lately?",
	"I miss you.",
	"Is your feature being used?",
	"The cake is a lie.",
	"Is next ft getting faster or slower?",
	"How popular is myFT these days?",
	"What are people searching for on next ft?",
	"I'm afraid I can't do that, Dave.",
	"Did someone say data?",
	"Making a new feature? Plan your dashboard up front.",
	"Ask #ft-next-data about your AB tests today!",
	"Robots are awesome, even if I do say so myself.",
	"/me rips out an awesome robot dance",
	"Whatever you do, don't ask about Disco Bucket.",
	"Is Game of Thrones out yet?",
]

module.exports = {
	randomMessage: () => {
		return messages[Math.floor(Math.random() * messages.length)];
	}
}
