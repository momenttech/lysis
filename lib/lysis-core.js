'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');
var parseHydraDocumentation = require('api-doc-parser/lib/hydra/parseHydraDocumentation').default;
require('./handlebars-helpers')();
var lysisUtils = require('./lysis-utils');

var LysisCore = function LysisCore() {
  var notifier = lysisUtils.notifier;
  this.on = function(name, callback) {
    notifier.subscribe(name, callback);
  };

  var startGenerators = function(apiConfig, api) {
    //console.log('generators', api);
    if (!apiConfig.generators || !(apiConfig.generators instanceof Object) || (Object.keys(apiConfig.generators).length === 0)) {
      notifier.emit('error', 'No generators found');
      return;
    }
    var generators = Object.keys(apiConfig.generators);
    for (var i = 0 ; i < generators.length ; i++) {
      var parameters = lysisUtils.getGeneratorParameters(api, apiConfig);
      parameters.generatorConfig = (apiConfig.generators[generators[i]] === null ? {} : apiConfig.generators[generators[i]]);
      //console.log(parameters);
      try {
        var generator = require(generators[i])(parameters);
      } catch(e) {
        notifier.emit('generator-error', {generator: generators[i], error: e});
      }
      lysisUtils.resetTemplates();
    }
  };

  var startApi = function(url, apiConfig) {
    notifier.emit('api-start', url);
    parseHydraDocumentation(url).then(api => {
      startGenerators(apiConfig, api);
      //console.log(api);
    }).catch((e) => {
      notifier.emit('api-error', {url: url, error: e});
    });
  };

  this.start = function(config) {
    if (!config.apis || !(config.apis instanceof Object) || (Object.keys(config.apis).length === 0)) {
      notifier.emit('error', 'APIs is not a list');
      return;
    }
    lysisUtils.init({
      dryRun: true,
      overwrite: false
    });
    var urls = Object.keys(config.apis);
    for (var i = 0 ; i < urls.length ; i++) {
      startApi(urls[i], config.apis[urls[i]]);
    }
  };


};

LysisCore.instance = null;

LysisCore.getInstance = function() {
  if (this.instance === null) {
    this.instance = new LysisCore();
  }
  return this.instance;
};

module.exports = LysisCore.getInstance();
