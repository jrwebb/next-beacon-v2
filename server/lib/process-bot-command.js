'use strict';

const KeenQuery = require('n-keen-query');
const natural = require('natural');
const classifier = new natural.LogisticRegressionClassifier();


let allQueries = [];
//Get all queries and store the questions in an array for later lookup
KeenQuery.aliases.poll().then(() => {
	allQueries = KeenQuery.aliases.get('');
	classifier.addDocument('test', 'false'); // add this otherwise all random queries return the first one in the list
	allQueries.forEach(query => {
		if(query.question) { classifier.addDocument(query.question, query.name); }
		if(query.label) { classifier.addDocument(query.label, query.name); }
	});
	classifier.train();
});


module.exports = (message) => {
	const name = classifier.classify(message);
	const exactMatch = allQueries.filter(q => q.name === message || q.question === message || q.label === message);
	return exactMatch.length ? exactMatch : KeenQuery.aliases.get(name);
}
