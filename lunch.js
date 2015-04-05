#!/usr/bin/env node
'use strict'
var _ = require('lodash');
var path = require('path');

var args = process.argv.slice(2);
var config_folder_path = path.join(__dirname, 'config');
var config = require('./modules/config_loader.js')(config_folder_path);


// handlers container, and add default
var handlers = {};
handlers[config.root_handler.lunch_list] = config.root_handler.default_handler;

// sub in handlers
for (var arg = 0; arg < args.length; arg++) {
  _.each(config.lunch_menu, function(menu) {
    var lunch_list_entries_keys = _.keys(config.lunch_lists[menu].entries);
    var arg_key_match = lunch_list_entries_keys.indexOf(args[arg]);
    if (arg_key_match !== -1) {
      handlers[menu] = lunch_list_entries_keys[arg_key_match];
      args.splice(arg, 1);
      arg--;
    }
  });
};

// assemble command
var command = "%s";
_.each(handlers, function(value, key) {
  command = command.replace("%s", config.lunch_lists[key].entries[value]);
});

command = command.replace("%s", args.join(" "));
console.log(command);
