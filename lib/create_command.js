'use strict';
var _ = require('lodash');

function ensure_parent_handler_present(handlers, config) {
  var rerun = false;
  _.each(_.keys(handlers).reverse(), function(handler) {
    var parent_handler = config.lunch_lists[handler].handled_by;
    var parent_handler_default  = config.lunch_lists[handler].default_handler;
    if (
      parent_handler &&
      parent_handler_default &&
      (!(parent_handler in handlers))
    ) {
      rerun = true;
      handlers[parent_handler] = parent_handler_default;
    }
  });
  return rerun;
}

function ensure_last_lunchlist_in_handlers(handlers, config) {
  // add last key
  var last_key = config.lunch_menu[config.lunch_menu.length - 1];
  if (!(last_key in handlers)) {
    handlers[last_key] = config.lunch_lists[last_key].root_default_handler;
  }
}

function extract_handlers(args,config) {
  var handlers = {};
  for (var arg = 0; arg < args.length; arg++) {
    _.each(config.lunch_menu, function(menu) {
      var lunch_list_entries_keys = _.keys(config.lunch_lists[menu].entries);
      var arg_key_match = lunch_list_entries_keys.indexOf(args[arg]);
      if (arg_key_match === -1) { return; }
      handlers[menu] = lunch_list_entries_keys[arg_key_match];
      args.splice(arg, 1);
      arg--;
    });
  };
  return handlers;
}

function create_command(args, config) {
  // handlers container, and add default
  var handlers = extract_handlers(args, config);
  var rerun_expand = true; while(rerun_expand) {
    rerun_expand = ensure_parent_handler_present(handlers, config);
  }
  ensure_last_lunchlist_in_handlers(handlers, config);

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

  return command;
}

module.exports = create_command;
