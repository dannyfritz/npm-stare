'use strict';
/**
	@module Starer
**/

var path = require('path');
var chokidar = require('chokidar');
var _ = require('lodash');
var spawn = require('cross-spawn').spawn;
var chalk = require('chalk');
var moment = require('moment');

function eventLog (filepath, exec, args) {
	var dateString = '[' + moment().format('H:mm:ss') + ']';
	var pathString = '[' + path.relative(process.cwd(), filepath) + ']';
	var execString = chalk.bold(exec) + ' ' +
		args.join(' ') + chalk.grey(' executing...');
	console.log(chalk.grey(dateString) + ' ' +
		chalk.green(pathString) + ' ' +
		chalk.green(execString));
}

function eventEndLog () {
	var dateString = '[' + moment().format('H:mm:ss') + ']';
	console.log(dateString + ' ' + chalk.green.bold('Task Succeeded!'));
}

/**
	@class Starer
	@param options {Object}
		@param watch {Object}
			@param path {String}
			@param exec {String}
**/
function newStarer (options) {
	var watches = options.watch;
	if (_.isUndefined(watches)) {
		return _.noop;
	}
	if (_.isArray(watches) === false) {
		watches = [ watches ];
	}
	return function starer () {
		_.each(watches, function eachWatch(watch) {
			var exec = _.first(watch.exec.split(' '));
			var args = _.rest(watch.exec.split(' '));
			var paths = watch.path;
			if (_.isArray(watch.path) === false) {
				paths = [ watch.path ];
			}
			_.each(paths, function eachPath(path) {
				console.log('Staring at ' + chalk.bgGreen(path));
				var watcher = chokidar.watch(path, {
					ignored: /[\/\\]\./,
					persistent: true
				});
				var running	= false;
				watcher.on('change', _.debounce(function changeEvent(path) {
						if (running === true) {
							return;
						}
						running	= true;
						eventLog(path, exec, args);
						var proc = spawn(exec, args, {
							env: process.env,
							cwd: process.cwd(),
							stdio: 'pipe'
						});
						proc.stdout.pipe(process.stdout);
						proc.on('exit', function exit(code) {
							if (code !== 0) {
								console.log(chalk.red.bold('Task Failed!'));
							} else if (code === 0) {
								eventEndLog();
							}
							running	= false;
						});
					}, 1000, { leading: true, trailing: false })
				);
			});
		});
	};
}

module.exports = newStarer;
