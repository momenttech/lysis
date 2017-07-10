var fs = require('fs');
var handlebars = require('handlebars');
var mkdirp = require('mkdirp');
var getContextFromApi = require('./get-context');

var Notifier = function Notifier() {
  this.events = {};
  this.subscribe = function(name, callback) {
    if (!this.events[name]) {
      this.events[name] = [callback];
    } else {
      this.events[name].push(callback);
    }
  };

  this.emit = function(name, args) {
    if (!this.events[name]) { return; }
    for (var i = 0 ; i < this.events[name].length ; i++) {
      this.events[name][i](args);
    }
  };
};

var LysisUtils = function LysisUtils() {
  this.notifier = new Notifier();

  this.config = {
    dryRun: true,
    overwrite: false
  };

  this.templates = {};

  /**
  * Initialize options
  * @param  Object options List of options to merge with the default config
  */
  this.init = function(options) {
    Object.assign(this.config, options);
  };

  /**
  * Change a string to lower or upper camel case
  *
  * @example lysisUtils.toCamelCase('hello-world') returns 'helloWorld'
  * @example lysisUtils.toCamelCase('hello-world', 'upper') returns 'HelloWorld'
  * @example lysisUtils.toCamelCase('hello_world') returns 'helloWorld'
  * @example lysisUtils.toCamelCase('good-morning_world') returns 'goodMorning_world'
  * @example lysisUtils.toCamelCase('HeLlO-WorLd') returns 'helloWorld'
  * @param  string text  The text to change
  * @param  string whichCase 'lower' for lower camel case, 'upper' for upper camel case
  * @return string       The camel case text
  */
  this.toCamelCase = function(text, whichCase) {
    if (whichCase !== 'upper') { whichCase = 'lower'; }
    var result = text.toLowerCase();

    var sep = ((text.indexOf('-') !== -1) ? '-' : '_');
    result = text.split(sep).map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
    if (whichCase === 'lower') {
      result = result.charAt(0).toLowerCase() + result.slice(1);
    }
    return result;
  };

  /**
  * Reset the handlebars templates list
  */
  this.resetTemplates = function() {
    this.templates = {};
  };

  /**
  * Register an handlebars template, which can be accessed via an identifier
  * @param  string id   The identifier, to access the template later
  * @param  string path The template path
  */
  this.registerTemplate = function(id, path) {
    this.templates[id] = handlebars.compile(fs.readFileSync(path).toString());
  };

  /**
  * Create a new file from an handlebars template.
  *
  * When config.dryRun is true, the generated file content is displayed (i.e.
  * not written)
  * @param  string id      The template identifier
  * @param  string dest    The file destination
  * @param  Object context The context provided to handlebars to generate files
  */
  this.createFile = function(id, dest, context) {
    if (!this.templates[id]) {
      this.notifier.emit('error', `The template "${id}" does not exist.`);
    }
    if (this.config.dryRun) {
      console.log('-'.repeat(80));
      console.log(`Generating "${dest}" from template "${id}"`);
      console.log('-'.repeat(80));
      console.log(this.templates[id](context));
    } else {
      fs.writeFileSync(dest, this.templates[id](context));
    }
  };

  /**
  * Evaluate a template and return the result
  * @param  string id      The template identifier, as defined during registration
  * @param  Object context The context to apply
  * @return string         The evaluated template
  */
  this.evalTemplate = function(id, context) {
    return this.templates[id](context);
  };

  /**
  * Create a new directory, recursively.
  *
  * When config.dryRun is true, the directory is not created.
  * @param string dir Directory path to create
  */
  this.createDir = function(dir) {
    if (this.config.dryRun) {
      console.log('-'.repeat(80));
      console.log(`Creating directory: "${dir}"`);
      console.log('-'.repeat(80));
      return;
    }
    if (fs.existsSync(dir)) {
      if (this.config.overwrite) {
        throw new Error(`The directory "${dir}" already exists`);
      }
    } else {
      mkdirp.sync(dir);
    }
  };

  /**
  * Check whether a file or a directory exists.
  *
  * It is almost the same as fs.exists, with dryRun capability.
  * @param  string path The path of a file or directory to check
  * @return boolean  true if the file exist, false when it does not or dryRun is enabled
  */
  this.exists = function(path) {
    if (this.config.dryRun) {
      return false;
    }
    return fs.existsSync(path);
  };

  /**
  * Get handlebars instance
  *
  * It is not really useful, except to avoid another dev dependency in generators.
  * @return handlebars handlebars instance
  */
  this.getHandlebars = function() {
    return handlebars;
  };

  /**
  * Set API config parameters, with default values when not provided
  *
  * @todo need more details
  * @param  {[type]} apiConfig [description]
  * @return {[type]}           [description]
  */
  this.getApiConfig = function(apiConfig) {
    return {
      basePath: (apiConfig.basePath ? apiConfig.basePath : ''),
      hydraPrefix: (apiConfig.hydraPrefix ? apiConfig.hydraPrefix : 'hydra:')
    };
  };

  /**
  * Get parameters to provide to the generator
  *
  * Properties of the generator parameters object:
  *  - rawApi: the whole API result from parseHydraDocumentation
  *  - context: formated API context
  *  - apiConfig: API additional configuration
  *  - generatorConfig: an empty object, set before generator call
  * @param  Object apiData   The raw result from the API
  * @param  Object apiConfig The configuration of API (i.e. configuration under API in the yaml file)
  * @return Object The parameters object with 4 properties
  */
  this.getGeneratorParameters = function(apiData, apiConfig) {
    if (!apiConfig) {
      apiConfig = {};
    }
    return {
      rawApi: apiData,
      context: getContextFromApi(apiData),
      config: this.getApiConfig(apiConfig),
      generatorConfig: {}
    };
  };

  this.getGeneratorTester = function() {
    return require('./lysis-tester');
  };
};

LysisUtils.instance = null;

LysisUtils.getInstance = function() {
  if (this.instance === null) {
    this.instance = new LysisUtils();
  }
  return this.instance;
};

module.exports = LysisUtils.getInstance();
