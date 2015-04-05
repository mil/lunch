#!/usr/bin/env node
'use strict'
//var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;
var basedir = require('xdg').basedir;

var args = process.argv.slice(2);
//var config_folder_path = path.join(__dirname, 'config');
var config_folder_path = basedir.configPath('lunch');
var config = require('./lib/config_loader.js')(config_folder_path);
if (args.length === 0) { process.exit(); }

var command = require('./lib/create_command.js')(args, config);

// run command
exec(command, function(error, stdout, stderr) {
  sys.puts(stdout);
});
