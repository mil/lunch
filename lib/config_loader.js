'use strict';
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var read_dir = require('fs-readdir-recursive');

function config_loader(config_dir) {
  return _.merge.apply({},
    _.map(read_dir(config_dir), function(file) {
      return yaml.safeLoad(
        fs.readFileSync(
          path.join(config_dir, file), 'utf-8'
        )
      );
    })
  );
}

module.exports = config_loader;
