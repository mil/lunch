'use strict';
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var read_dir = require('fs-readdir-recursive');

function raise_error(err_buffer) {
  throw new Error(err_buffer);
}

function assert_lunchmenu_is_valid(config) {
  if (!('lunch_menu' in config)) {
    raise_error('lunch_menu does not exist');
  }
  if (!_.isArray(config['lunch_menu'])) {
    raise_error('lunch_menu is not an array');
  }
  if (config['lunch_menu'].length === 0) {
    raise_error('lunch_menu needs atleast one lunchlist handler');
  }
  _.each(config['lunch_menu'], function(handler) {
    if (!_.isString(handler)) {
      raise_error('Handler "' + String(handler) + '" is not a string');
    }
    if (!(handler in config.lunch_lists)) {
      raise_error(
        'Handler "' + handler +
        '" referenced in lunch_list but not defined'
      );
    }
  });

  return config;
}

function config_loader(config_dir) {
  var config = _.merge.apply({},
    _.map(read_dir(config_dir), function(file) {
      var y = yaml.safeLoad(
        fs.readFileSync(
          path.join(config_dir, file), 'utf-8'
        )
      );
      if (typeof y !== 'object') {
        raise_error("YAML in file " + config_dir + "/" + file + " is invalid");
      }
      return y;
    })
  );

  return assert_lunchmenu_is_valid(config);
}

module.exports = config_loader;
