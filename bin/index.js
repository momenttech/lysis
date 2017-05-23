#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var semver = require('semver');
var Liftoff = require('liftoff');
var tildify = require('tildify');
var v8flags = require('v8flags');
var argv = require('minimist')(process.argv.slice(2));

// very inspired form gulp, thank you!

// Set env var for ORIGINAL cwd
// before anything touches it
process.env.INIT_CWD = process.cwd();

var cli = new Liftoff({
  name: 'api-lysis',
  configName: 'lysis',
  extensions: { '.yml': 'require-yaml' },
  v8flags: v8flags,
});

// Exit with 0 or 1
var failed = false;
process.once('exit', function(code) {
  if (code === 0 && failed) {
    process.exit(1);
  }
});

// Parse those args m8
var cliPackage = require('../package');
var versionFlag = argv.v || argv.version;

// Wire up logging events
function logEvents(lysisInst) {
  lysisInst.on('error', function(message) {
    failed = true;
    if (message) {
      console.log(chalk.red(message));
    }
  });

  lysisInst.on('message', function(message) {
    console.log(message);
  });

  lysisInst.on('api-start', function(url) {
    console.log('Starting API', '\'' + chalk.cyan(url) + '\'...');
  });

  lysisInst.on('api-stop', function(url) {
    console.log('Finished API', '\'' + chalk.cyan(url) + '\'...');
  });

  lysisInst.on('api-error', function(e) {
    console.log(chalk.red('Error for API'), '\'' + chalk.cyan(e.url) + '\'');
    console.log(e.error.message);
  });

  lysisInst.on('generator-start', function(e) {
    console.log('Starting', '\'' + chalk.cyan(e.generator) + '\'...');
  });

  lysisInst.on('generator-stop', function(e) {
    console.log(
      'Finished', '\'' + chalk.cyan(e.generator) + '\''
    );
  });

  lysisInst.on('generator-error', function(e) {
    console.log(chalk.red('Error for generator'), '\'' + chalk.cyan(e.generator) + '\'');
    console.log(e.error.message);
  });

  lysisInst.on('generator-not-found', function(err) {
    console.log(
      chalk.red('Task \'' + err.generator + '\' is not in your lysis file')
    );
    console.log('Please check the documentation for proper lysis file formatting');
    process.exit(1);
  });
}

// The actual logic
function handleArguments(env) {
  if (versionFlag) {
    console.log('CLI version', cliPackage.version);
    if (env.modulePackage && typeof env.modulePackage.version !== 'undefined') {
      console.log('Local version', env.modulePackage.version);
    }
    process.exit(0);
  }

  if (!env.modulePath) {
    console.log(
      chalk.red('Local lysis not found in'),
      chalk.magenta(tildify(env.cwd))
    );
    console.log(chalk.red('Try running: npm install lysis'));
    process.exit(1);
  }

  if (!env.configPath) {
    console.log(chalk.red('No lysis file found'));
    process.exit(1);
  }

  // Check for semver difference between cli and local installation
  if (semver.gt(cliPackage.version, env.modulePackage.version)) {
    console.log(chalk.red('Warning: lysis version mismatch:'));
    console.log(chalk.red('Global lysis is', cliPackage.version));
    console.log(chalk.red('Local lysis is', env.modulePackage.version));
  }

  // Chdir before requiring lysis file to make sure
  // we let them chdir as needed
  if (process.cwd() !== env.cwd) {
    process.chdir(env.cwd);
    console.log(
      'Working directory changed to',
      chalk.magenta(tildify(env.cwd))
    );
  }

  // This is what actually loads up the lysis yaml config file
  var config = require(env.configPath);
  console.log('Using lysis file', chalk.magenta(tildify(env.configPath)));
  var lysisInst = require(env.modulePath).core;
  logEvents(lysisInst);

  lysisInst.start(config);
}

cli.on('require', function(name) {
  console.log('Requiring external module', chalk.magenta(name));
});

cli.on('requireFail', function(name) {
  console.log(chalk.red('Failed to load external module'), chalk.magenta(name));
});

cli.launch({
  cwd: argv.cwd,
  configPath: argv.conffile,
  require: argv.require
}, handleArguments);
