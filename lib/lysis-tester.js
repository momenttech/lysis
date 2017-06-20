'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');
var parseHydraDocumentation = require('api-doc-parser/lib/hydra/parseHydraDocumentation').default;
require('./handlebars-helpers')();
var lysisUtils = require('./lysis-utils');

var GeneratorTester = function() {
  this.url = '';
  this.generator = '';
  this.generatorAdditionalConfig = {};
  this.apiConfig = {};
  this.lysisInit = {
    dryRun: true,
    overwrite: false
  };

  this.setUrl = function(url) {
    this.url = url;
    return this;
  };

  this.setGenerator = function(generator) {
    this.generator = generator;
    return this;
  };

  this.setGeneratorAdditionalConfig = function(generatorAdditionalConfig) {
    this.generatorAdditionalConfig = generatorAdditionalConfig;
    return this;
  };

  this.setApiConfig = function(apiConfig) {
    this.apiConfig = apiConfig;
    return this;
  };

  this.setLysisInit = function(lysisInit) {
    this.lysisInit = lysisInit;
    return this;
  };

  this.startGenerator = function(apiResult) {
    var parameters = lysisUtils.getGeneratorParameters(apiResult, this.apiConfig);
    parameters.generatorConfig = this.generatorAdditionalConfig;
    (this.generator)(parameters);
  };

  this.test = function() {
    console.log('Starting generator test on "' + this.url + '"');
    lysisUtils.init(this.lysisInit);
    parseHydraDocumentation(this.url).then(api => {
      this.startGenerator(api);
      //console.log(api);
    }).catch((e) => {
      console.log('error while testing "' + this.url + '"', e);
    });
  };
};

GeneratorTester.instance = null;

GeneratorTester.getInstance = function() {
  if (this.instance === null) {
    this.instance = new GeneratorTester();
  }
  return this.instance;
};
module.exports = GeneratorTester.getInstance();
