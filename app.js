var
  config=require('./config.js'),
  _=require('lodash'),
  redis=require('then-redis'),
  knex=require('knex')(config.knex),
  cluster = require('cluster'),
  debug=require('./debug.js');

var proxyw=config.proxy.workers,
  frontw=config.front.workers;

if(cluster.isMaster) {
  debug=debug('blue','master');

  cores=require('os').cpus().length;
  debug('opening %s proxy workers, %s front workers (makenodes: %s)',
    proxyw,frontw,config.server.makenodes);

  //listen for revving, and then make nodes on command
  if(config.server.makenodes) {
    var sub=config.rdcl(redis).bbmsg(),
      rdcl=config.rdcl(redis),
      machid;

    //grabs machine id, reports cores for that id, waits for plan, grabs plan
    sub('machine.rev').then(function(message) {
      debug('rev received. incr machineid');
      return rdcl.incr('machineid');
    }).then(function(id) {
      machid=id;
      debug('id is %s',id);
      rdcl.set('machine:'+id+':cores',cores);
      return sub('machine.plan');
    }).then(function() {
      return rdcl.smembers('machine:'+machid+':plan');
    }).then(function(plan) {
      debug('I am responsible for %s',plan);
      for(i in plan) cluster.fork({zdelu_system:plan[i]});
    });
  }
  for(var i=0;i<proxyw+frontw;i++) {
    cluster.fork();
  }
  if(config.server.rev) {
    require('./master/rev.js')(knex);
  }
} else {
  var id=cluster.worker.id;
  if(id<=proxyw) {
    debug=debug('magenta','proxy',id);
    require('./proxy')(debug);
  } else if(id<=proxyw+frontw) {
    debug=debug('green','front',id-proxyw);
    require('./front')(debug,knex);
  } else {
    //use the appropriate script to run the gameserver
    require('./server')(debug,knex,id);
  }
}
