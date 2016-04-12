'use strict';

import KeenQuery from 'keen-query';
import querystring from 'querystring';
import {renderChart} from '../components/chart';

// const debounce = function(fn,delay){
// 		let timeoutId;
// 		return function debounced(){
// 				if(timeoutId){
// 						clearTimeout(timeoutId);
// 				}
// 				const args = arguments;
// 				timeoutId = setTimeout(function() {
// 						fn.apply(this, args);
// 				}.bind(this), delay);
// 		};
// };

// class PropertySearch {

// 	constructor () {
// 		this.searchEl = document.querySelector('.query-wizard__properties-filter');
// 		this.items = [].slice.call(document.querySelectorAll('.query-wizard__reference--properties .o-buttons'))
// 			.map(el => {
// 				return {
// 					el,
// 					property: el.getAttribute('data-str')
// 				}
// 			});
// 	}
// 	init () {
// 		const self = this;

// 		this.onType = debounce(this.onType, 150).bind(this);

// 		this.searchEl.addEventListener('keyup', function(ev) {
// 			switch(ev.which) {
// 				case 13 : return; // enter
// 				case 9 : return; // tab
// 				case 40 : return;
// 				default :
// 					self.onType(ev);
// 				break;
// 			}
// 		});
// 	}

// 	onType () {
// 		const str = this.searchEl.value.toLowerCase();
// 		this.items.forEach(item => {
// 			if (item.property.indexOf(str) === -1) {
// 				item.el.classList.add('hidden');
// 			} else {
// 				item.el.classList.remove('hidden');
// 			}
// 		})
// 	}
// }
const Delegate = require('dom-delegate');

module.exports = {
	init: () => {
		const del = new Delegate(document.querySelector('.query-wizard'));
		// new PropertySearch().init();

		const input = document.querySelector('.query-wizard__input');
		const output = document.querySelector('.query-wizard__output');
		const viewButton = document.querySelector('.query-wizard__view');

		const parameters = querystring.parse(location.search.substr(1));
		if (parameters.query) {
			input.value = decodeURIComponent(parameters.query);
			run();
		}


		function validate (str) {
			return new Promise((res, rej) => {
				str = str || input.value.trim();
				try {
					KeenQuery.build(str);
					if (output.querySelector('.error')) {
						output.innerHTML = '';
					}
					res(str);
				} catch (e) {
					rej(e);
				}
			});
		}

		function outputError (e) {
			let txt = e.message || e;
			if (/^Queries must begin/.test(txt)) {
				txt += '. Have you completed <b>Step 1</b> yet?';
			}
			output.innerHTML = `<span class="error">${txt}</span>`;
		}

		function sanitisedQuery () {
			let q = KeenQuery.format(input.value, '  ');
			let printer = '';
			q = q.replace(/\s*->print\(\w+\)/g, function (match) {
				printer = match;
				return '';
			}) + printer;
			input.value = q;
			return q;
		}

		function dePrinteredQuery () {
			sanitisedQuery();
			let q = KeenQuery.format(input.value, '  ');
			let printer = '';
			q = q.replace(/\s*->print\((\w+)\)/g, function (match, p) {
				printer = p;
				return '';
			});
			return {q, printer}
		}

		function run() {
			let kq = KeenQuery.build(sanitisedQuery())
			if (!kq._printer) {
				kq = kq.setPrinter('LineChart');
			}
			const queryAsUrl = encodeURIComponent(kq.toString().replace('->print(LineChart)', ''));
			history.pushState({}, "", `/data/query-wizard?query=${queryAsUrl}`);
			viewButton.href = `/chart/custom-query?query=${queryAsUrl}`;
			return renderChart(output, kq, {})
		}

		input.addEventListener('keydown', ev => {
			if (ev.keyCode === 13 && !ev.shiftKey) {
				ev.preventDefault();
			}
		})

		input.addEventListener('keyup', ev => {
			if (ev.keyCode === 13 && !ev.shiftKey) {
				run();
				return false;
			}
		})
		document.querySelector('.query-wizard__form').addEventListener('submit', ev => {
			ev.preventDefault();
			run();
		})



		del.on('click', '.query-wizard__reference--starters .o-buttons, .query-wizard__reference--collections .o-buttons', ev => {
			input.value = ev.target.getAttribute('data-str');
			output.innerHTML = '';
			input.focus();
		});

		del.on('click', '.query-wizard__clear-output', ev => {
			ev.preventDefault();
			output.innerHTML = '';
		})

		del.on('click', '.query-wizard__copy-yaml', () => {
			const queryConf = dePrinteredQuery();
			const kq = KeenQuery.build(queryConf.q);
			const copyTextarea = document.createElement('textarea');
			let yaml =`
  -
    question: Enter a title for the chart in the form of a question
    name: Enter a name for your chart to be used as its url e.g. "users/daily"
    query: "${kq.toString()}"`;
			if (queryConf.printer) {
				yaml +=`
    printer: ${queryConf.printer}`;
			}
			copyTextarea.textContent = yaml;
			document.documentElement.appendChild(copyTextarea);
			copyTextarea.select();

			try {
				document.execCommand('copy');
				document.documentElement.removeChild(copyTextarea);
				alert('Copied! Now either add to your dashboard at https://github.com/Financial-Times/next-beacon-v2/tree/master/dashboards, or ask a developer to help you do so');
			} catch (err) {
				document.documentElement.removeChild(copyTextarea);
				alert('Oops, unable to copy');
			}
		})


		del.on('click', '.query-wizard__reference--extractions .o-buttons', ev => {
			validate(input.value + '->' + ev.target.getAttribute('data-str'))
				.then(str => {
					input.value = str;
					input.focus();
				}, e => {
					outputError(e);
					input.focus();
				})
		});

		del.on('click', '.query-wizard__reference--methods .o-buttons', ev => {
			validate()
				.then(() => {
					input.value += '\n->' + ev.target.getAttribute('data-str');
					input.focus();
				}, e => {
					outputError(e);
					input.focus();
				})

		});

		// del.on('click', '.query-wizard__reference--properties', ev => {
		// 	if (/\)$/.test(input.value)) {
		// 		input.value = input.value.replace(/\{use the metadata picker\}/, `{${ev.target.textContent}}`).replace(/\([^\)]*\)$/, `(${ev.target.textContent})`);
		// 		input.focus();
		// 	}
		// })

	}
}
