#!/usr/bin/env node
'use strict'

var config = require('./modules/config_loader.js')(
  __dirname + '/config'
);
console.log(config);
