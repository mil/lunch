#!/usr/bin/env node
'use strict'
var _ = require('lodash');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;
var basedir = require('xdg').basedir;

var args = process.argv.slice(2);
//var config_folder_path = path.join(__dirname, 'config');
var config_folder_path = basedir.configPath('lunch');
var config = require('./modules/config_loader.js')(config_folder_path);


// handlers container, and add default
var handlers = {};

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

function ensure_parent_handler_present() {
  var rerun = false;
  _.each(_.keys(handlers).reverse(), function(handler) {
    var parent_handler = config.lunch_lists[handler].handled_by;
    var parent_handler_default  = config.lunch_lists[handler].default_handler;
    if (parent_handler && parent_handler_default) {
      if (!(parent_handler in handlers)) { rerun = true; }
      handlers[parent_handler] = parent_handler_default;
    }
  });
  return rerun;
}
var rerun_expand = true;
while (rerun_expand) { rerun_expand = ensure_parent_handler_present(); }

// add in root handler if its not already
if (!(config.root_handler.lunch_list in handlers)) {
  handlers[config.root_handler.lunch_list] = config.root_handler.default_handler;
}

// ensure correct ordering
var handlers_keys = _.keys(handlers).sort(function(a, b) {
  var lists = _.keys(config.lunch_lists);
  return lists.indexOf(a) > lists.indexOf(b) ? -1 : 1;
});

// assemble command
var command = "%s";
_.each(handlers_keys, function(k) {
  command = config.lunch_lists[k].entries[handlers[k]].replace("%s", command);
});
command = command.replace("%s", args.join(" "));

// run command
exec(command, function(error, stdout, stderr) {
  sys.puts(stdout);
});
