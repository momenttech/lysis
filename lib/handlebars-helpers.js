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
		if (!text) { return ''; }
		return text.toLowerCase();
	});

	// Change string to uppercase ***********************************************
	handlebars.registerHelper('uc', function(text) {
		if (!text) { return ''; }
		return text.toUpperCase();
	});

	// Change string to lower camel case ****************************************
	handlebars.registerHelper('lcc', function(text) {
		if (!text) { return ''; }
		return lysisUtils.toCamelCase(text, 'lower');
	});

	// Change string to upper camel case ****************************************
	handlebars.registerHelper('ucc', function(text) {
		if (!text) { return ''; }
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

	// Return JavaScript type according to field type ***************************
	handlebars.registerHelper('jsType', function(fieldType) {
		if (!fieldType.scalar) {
			return fieldType.type;
		}
	  switch (fieldType.type) {
	    case 'boolean':
	    return fieldType.type;
	    case 'date':
	    case 'time':
	    case 'dateTime':
	    return 'Date';
	    case 'integer':
	    case 'decimal':
	    return 'number';
	    case 'any':
	    return 'any';
	    default:
	    return 'string';
	  }
	});
};
