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
					property: el.getAttribute('data-property')
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

module.exports = {
	init: () => {

		new PropertySearch().init();

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
