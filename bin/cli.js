#!/usr/bin/env node

'use strict';

var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var newStarer = require('../');
var pkg = require(path.join(process.cwd(), './package.json'));

if (_.isUndefined(pkg.stare)) {
	console.log(chalk.red.bold('ERROR:'));
	console.log(
		chalk.white('package.json required. Try ') +
		chalk.underline('npm init'));
	process.exit(1);
}

if (_.isUndefined(pkg.stare)) {
	console.log(chalk.red.bold('ERROR:'));
	console.log(chalk.white('package.json requires a stare property.'));
	process.exit(1);
}

if (_.isObject(pkg.stare) === false) {
	console.log(chalk.red.bold('ERROR:'));
	console.log(chalk.white('package.stare must be an Object.'));
	process.exit(1);
}

var options = {};

options.watch = _.reduce(pkg.stare, function reduce(watches, stare, npmTask) {
	if (_.isUndefined(stare.path)) {
		console.log(chalk.yellow('WARNING: ' +
			'Skipping a stare because it is missing a path vaule'));
		console.log(stare);
		return watches;
	}
	watches.push({
		path: stare.path,
		exec: 'npm run ' + npmTask,
		events: stare.events
	});
	return watches;
}, []);

var starer = newStarer(options);

starer();
