'use strict';

var handlebars = require('handlebars');
var lysisUtils = require('./lysis-utils');

module.exports = function() {
	// Make string URI compatible, thanks to encodeURIComponent *****************
	handlebars.registerHelper('slugize', function(item) {
		return encodeURIComponent(item);
	});

	// Change string to lowercase ***********************************************
	handlebars.registerHelper('lc', function(text) {
		return text.toLowerCase();
	});

	// Change string to uppercase ***********************************************
	handlebars.registerHelper('uc', function(text) {
		return text.toUpperCase();
	});

	// Change string to lower camel case ****************************************
	handlebars.registerHelper('lcc', function(text) {
		return lysisUtils.toCamelCase(text, 'lower');
	});

	// Change string to upper camel case ****************************************
	handlebars.registerHelper('ucc', function(text) {
		return lysisUtils.toCamelCase(text, 'upper');
	});

	// Change a JavaScript variable as JSON *************************************
	handlebars.registerHelper('json', function(o) {
		return JSON.stringify(o);
	});

	// A == B, works like {{if}}, i.e. it is compatible with else ***************
	handlebars.registerHelper('eq', function(a, b, opts) {
		if (a == b) { // jshint ignore:line
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	// A != B, works like {{if}}, i.e. it is compatible with else ***************
	handlebars.registerHelper('neq', function(a, b, opts) {
		if (a != b) { // jshint ignore:line
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	// A < B, works like {{if}}, i.e. it is compatible with else ****************
	handlebars.registerHelper('lt', function(a, b, opts) {
		if (a < b) {
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	// A > B, works like {{if}}, i.e. it is compatible with else ****************
	handlebars.registerHelper('gt', function(a, b, opts) {
		if (a > b) {
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	// Return a if set, otherwise b is returned *********************************
	handlebars.registerHelper('default', function(a, b) {
		return a ? a : b;
	});

};
