var
  config=require('../config.js'),
  redis=require('then-redis'),
  WSServer=require('./WSServer.js');

modules.export=function(debug,knex,rdcl,name) {
  debug('doorman');
};
