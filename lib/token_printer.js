'use strict';
var _ = require('lodash');

function token_printer(config) {
  return _.union.apply([], _.map(config['lunch_lists'], function(e) {
      return _.keys(e.entries);
  }));
}

module.exports = token_printer;
