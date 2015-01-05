var
  config=require('../config.js'),
  Promise=require('bluebird'),
  redis=require('redis');

if(!module.parent) {
  rev(require('knex')(config.knex));
} else {
  module.exports=rev;
}

//setTimeout that returns a promise
function delay(ms) {
  var deferred=Promise.pending();
  setTimeout(function(){
    deferred.fulfill();
  },ms);
  return deferred.promise;
}

function rev(knex) {
  var debug=require('../debug.js')('red','rev');
  var universe=require('./architect.js'),
    sub=Promise.promisifyAll(redis.createClient(config.redis)),
    pub=redis.createClient(config.redis);
  return require('./dbcheck.js')(debug,knex).then(function(created) {
    if(created) return require('./builder.js')(debug,knex,universe);
  }).then(function() {
    debug('revving now.');
    pub.set('nodeid',0);
    pub.publish('node.rev','gotta go fast');
    debug('waiting...');
  }).then(function() {
    //wait for servers to respond to rev
    return delay(config.server.rev);
  }).then(function() {
    //get how many nodes responded to the rev
    return sub.getAsync('nodeid');
  }).then(function(nodes) {
    debug('%s nodes responded',nodes);
    //allocator decides load balancing
    var plan=require('./allocator.js')(debug,nodes,universe);
    //pass each node the system ids they are responsible for
    plan.forEach(function(v,i) {
      //debug('rev.'+i,JSON.stringify(v));
      pub.publish('rev.'+i,JSON.stringify(v));
    });
    //close up shop
    sub.quit();
    pub.quit();
    debug('revved successfully.');
    if(module.parent) return;
    process.exit();
  });
}
