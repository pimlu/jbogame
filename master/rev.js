var
  config=require('../config.js'),
  redis=require('redis');

if(!module.parent) {
  rev(require('../debug.js')('blue','main'),
    require('knex')(config.knex));
} else {
  module.exports=rev;
}

function rev(debug,knex) {
  return require('./dbcheck.js')(debug,knex).then(function(created) {
    if(created) return require('./builder.js')(debug,knex);
  }).then(function() {
    debug('revving now.');
    var pub=redis.createClient(config.redis);
    pub.set('nodeid',0);
    pub.publish('node.rev','gotta go fast');
    pub.quit();
  });
}
