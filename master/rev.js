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
    sub=config.rdcl(redis),
    pub=config.rdcl(redis);
  var machines,machinecores=[];
  return require('./dbcheck.js')(debug,knex).then(function(created) {
    if(created) return require('./builder.js')(debug,knex,universe);
  }).then(function() {
    //resets db, sends rev, waits for machine/core responses,
    //allocates based on machines, stores plan
    debug('revving now.');
    pub.flushdb();
    pub.set('machineid',-1);//so incr starts at 0 lol
    pub.publish('machine.rev','gotta go fast');
    debug('waiting...');
  }).then(function() {
    //wait for servers to respond to rev
    return delay(config.server.rev);
  }).then(function() {
    return sub.get('machineid');
  }).then(function(machid) {
    machines=+machid;
    //fill machinecores with the number of cores of each machineid
    return Promise.all(Array.apply(null,Array(machines+1)).map(function(v,id) {
      return pub.get('machine:'+id+':cores').then(function(cores) {
        machinecores[id]=cores;
      });
    }));
  }).then(function() {
    debug('%s machines responded',machines+1);
    //allocator decides load balancing
    var plan=require('./allocator.js')(debug,machinecores,universe);
    plan.forEach(function(v,nodeid) {
      //pass each node the system ids they are responsible for
      pub.sadd('machine:'+nodeid+':plan',v);
    });
    pub.publish('machine.plan',':^)');

    sub.quit();
    //wait till pub's done quitting, just in case process.exit is a problem
    pub.quit().then(function() {
      debug('revved successfully.');
      if(!module.parent) process.exit();
    });
  });
}
