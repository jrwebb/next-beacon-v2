/*global fetch*/
const Delegate = require('dom-delegate');
// const isOutside = require('./is-outside');

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

function FeatureSearch() {
	this.container = document.querySelector('.feature-search');
	this.searchEl = document.querySelector('.feature-search__input');
	this.minLength = 2;
}

FeatureSearch.prototype.init = function () {
	const self = this;

	var head = document.head || document.getElementsByTagName('head')[0];
  this.style = document.createElement('style');
  this.style.type = 'text/css';
  head.appendChild(this.style);

	this.delegate = new Delegate(this.container);
	this.onType = debounce(this.onType, 150).bind(this);

	this.delegate.on('keyup', '.feature-search__input', function(ev) {
		switch(ev.which) {
			case 13 : return; // enter
			case 9 : return; // tab
			case 40 : return;
			default :
				self.onType(ev);
			break;
		}
	});
};

FeatureSearch.prototype.reveal = function (str) {

	var css = '.feature-search__features [data-feature^=' + str + '] {display: block}';
	if (this.style.styleSheet) {
		this.style.styleSheet.cssText = css;
	} else {
		this.style.firstChild && this.style.removeChild(this.style.firstChild);
		this.style.appendChild(document.createTextNode(css));
	}
}

FeatureSearch.prototype.onType = function () {
	this.reveal(this.searchEl.value);
};


module.exports = new FeatureSearch();
