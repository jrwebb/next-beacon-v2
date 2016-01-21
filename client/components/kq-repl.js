'use strict';

const KeenQuery = require('n-keen-query');
const debounce = function(fn,delay){
		let timeoutId;
		return function debounced(){
				if(timeoutId){
						clearTimeout(timeoutId);
				}
				const args = arguments;
				timeoutId = setTimeout(function() {
						fn.apply(this, args);
				}.bind(this), delay);
		};
};

class PropertySearch {

	constructor () {
		this.searchEl = document.querySelector('.kq-repl__properties-filter');
		this.items = [].slice.call(document.querySelectorAll('.kq-repl__reference--properties li'))
			.map(el => {
				return {
					el,
					property: el.getAttribute('data-str')
				}
			});
	}
	init () {
		const self = this;

		this.onType = debounce(this.onType, 150).bind(this);

		this.searchEl.addEventListener('keyup', function(ev) {
			switch(ev.which) {
				case 13 : return; // enter
				case 9 : return; // tab
				case 40 : return;
				default :
					self.onType(ev);
				break;
			}
		});
	}

	onType () {
		const str = this.searchEl.value.toLowerCase();
		this.items.forEach(item => {
			if (item.property.indexOf(str) === -1) {
				item.el.classList.add('hidden');
			} else {
				item.el.classList.remove('hidden');
			}
		})
	}
}
const Delegate = require('dom-delegate');

module.exports = {
	init: () => {
		const del = new Delegate(document.querySelector('.kq-repl'));
		new PropertySearch().init();

		const input = document.querySelector('.kq-repl__input');
		const output = document.querySelector('.kq-repl__output');

		function validate (str) {
			return new Promise((res, rej) => {
				str = str || input.value.trim();
				try {
					KeenQuery.build(str);
					res(str);
				} catch (e) {
					rej(e);
				}
			});
		}

		function run() {
			const query = input.value.trim();
			try {
				const keenQuery = KeenQuery.build(query);

				keenQuery
					.print('html')
					.then(func => {
						func(output, {})
					}, e => output.textContent = e.message || e);
				} catch (e) {
					output.innerHTML = `<span class="error">${e.message || e}</span>`;
				}
		}

		input.addEventListener('keydown', ev => {
			if (ev.keyCode === 13) {
				ev.preventDefault();
			}
		})

		input.addEventListener('keyup', ev => {
			if (ev.keyCode === 13) {
				run();
				return false;
			}
		})
		document.querySelector('.kq-repl__form').addEventListener('submit', ev => {
			ev.preventDefault();
			run();
		})

		del.on('click', '.kq-repl__reference--collections .o-buttons', ev => {
			input.value = ev.target.getAttribute('data-str');
			input.focus();
		});

		del.on('click', '.kq-repl__reference--extractions li', ev => {
			validate(input.value + '->' + ev.target.getAttribute('data-str'))
				.then(str => {
					input.value += str;
					input.focus();
				}, e => {
					output.innerHTML = `<span class="error">${e.message || e}</span>`;
					input.focus();
				})
		});

		del.on('click', '.kq-repl__reference--methods li', ev => {
			validate()
				.then(() => {
					input.value += '->' + ev.target.getAttribute('data-str');
					input.focus();
				}, e => {
					output.innerHTML = `<span class="error">${e.message || e}</span>`;
					input.focus();
				})

		});

		del.on('click', '.kq-repl__reference--properties', ev => {
			if (/\)$/.test(input.value)) {
				input.value = input.value.replace(/\{props?\}/, `{${ev.target.textContent}}`).replace(/\([^\)]*\)$/, `(${ev.target.textContent})`);
				input.focus();
			}
		})

	}
}
