var
  config=require('../config.js'),
  Promise=require('bluebird'),
  redis=require('then-redis');

if(!module.parent) {
  rev(require('knex')(config.knex));
} else {
  module.exports=rev;
}

//setTimeout that returns a promise
function delay(ms) {
  return new Promise(function(resolve,reject) {
    setTimeout(resolve,ms);
  });
}

function rev(knex) {
  var debug=require('../debug.js')('red','rev');
  var universe=require('./architect.js'),
    sub=redis.createClient(config.redis),
    pub=redis.createClient(config.redis);
  return require('./dbcheck.js')(debug,knex).then(function(created) {
    if(created) return require('./builder.js')(debug,knex,universe);
  }).then(function() {
    debug('revving now.');
    pub.flushdb();
    pub.set('nodeid',0);
    pub.publish('node.rev','gotta go fast');
    debug('waiting...');
  }).then(function() {
    //wait for servers to respond to rev
    return delay(config.server.rev);
  }).then(function() {
    //get how many nodes responded to the rev
    return sub.get('nodeid');
  }).then(function(nodes) {
    debug('%s nodes responded',nodes);
    //allocator decides load balancing
    var plan=require('./allocator.js')(debug,nodes,universe);
    plan.forEach(function(v,nodeid) {
      //pass each node the system ids they are responsible for
      pub.sadd('node:'+nodeid+':plan',v);
      //now make a key for each system that points to its node
      v.forEach(function(systemid) {
        pub.set('systems:'+systemid+':node',nodeid);
      });
    });
    pub.publish('node.plan',':^)');

    sub.quit();
    //wait till pub's done quitting, just in case process.exit is a problem
    pub.quit().then(function() {
      debug('revved successfully.');
      if(!module.parent) process.exit();
    });
  });
}
