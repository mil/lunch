#!/usr/bin/env node
'use strict'
//var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));
var basedir = require('xdg').basedir;


var config_folder_path = argv['config-folder'] ?
  argv['config-folder'] : basedir.configPath('lunch');
var config = require('./lib/config_loader.js')(config_folder_path);


if ('token-list' in argv) {
  sys.log(
    require('./lib/token_printer')(config)
  );
} else {
  if (argv._.length === 0) { process.exit(); }
  var command = require('./lib/create_command.js')(argv._, config);
  exec(command, function(error, stdout, stderr) {
    sys.log(stdout);
  });
}
