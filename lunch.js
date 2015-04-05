#!/usr/bin/env node
'use strict'
var _ = require('lodash');
var path = require('path');

var args = process.argv.slice(2);
var config_folder_path = path.join(__dirname, 'config');
var config = require('./modules/config_loader.js')(config_folder_path);


var appetizers_set_array = [];
_.each(args, function(arg) {
  _.each(config.lunch_menu, function(menu) {
    var lunch_list_entries_keys = _.keys(config.lunch_lists[menu].entries);
    var arg_key_match = lunch_list_entries_keys.indexOf(arg);
    if (arg_key_match !== -1) {
      console.log(config.lunch_lists[menu].handled_by);
      console.log(menu);
      console.log(lunch_list_entries_keys[arg_key_match]);
      //appetizers_set_array.push({
      //  value: 
      //});
      //console.log("matches", );
      
    }
    //console.log(menu);
  });

});

//_.each(config.lunch_menu, function(menu) {
//  console.log(menu);
//});
// canopy peg
//console.log(config);
