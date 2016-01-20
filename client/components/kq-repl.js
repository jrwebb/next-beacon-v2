'use strict';

const KeenQuery = require('n-keen-query');

module.exports = {
	init: () => {

		const input = document.querySelector('.kq-repl__input');
		const output = document.querySelector('.kq-repl__output');

		function run() {
			const query = input.value.trim();
			KeenQuery.build(query)
				.print('html')
				.then(func => {
					func(output, {})
				}, e => output.textContent = e.message || e);
			window.scrollTo(0, 0);
		}

		input.addEventListener('keydown', ev => {
			if (ev.keyCode == 13) {
				ev.preventDefault();
			}
		})

		input.addEventListener('keyup', ev => {
			if (ev.keyCode == 13) {
				run();
				return false;
			}
		})
		document.querySelector('.kq-repl__form').addEventListener('submit', ev => {
			ev.preventDefault();
			run();
		})
		document.querySelector('.kq-repl__reference--collections').addEventListener('click', ev => {
			if (ev.target.nodeName === 'LI') {
				input.value = ev.target.textContent;
				input.focus();
			}
		});

		[].slice.call(document.querySelectorAll('.kq-repl__reference--methods')).forEach(el => {
			el.addEventListener('click', ev => {
				if (ev.target.nodeName === 'LI') {
					input.value += '->' + ev.target.textContent + '()';
					input.focus();
				}
			})
		});

		document.querySelector('.kq-repl__reference--properties').addEventListener('click', ev => {
			if (ev.target.nodeName === 'LI') {
				if (/\)$/.test(input.value)) {
					input.value = input.value.replace(/\([^\)]*\)$/, `(${ev.target.textContent})`);
					input.focus();
				}
			}
		})

	}
}
