var
  config=require('./config.js'),
  _=require('lodash'),
  redis=require('redis'),
  knex=require('knex')(config.knex),
  cluster = require('cluster'),
  debug=require('./debug.js');

var proxyw=config.proxy.workers,
  frontw=config.front.workers,
  nodew=config.server.workers;

if(cluster.isMaster) {
  debug=debug('blue','master');

  //only make node workers if we're a node server
  nodew=config.server.makenodes?require('os').cpus().length:0;
  debug('opening %s proxy workers, %s front workers (%s nodes)'
  ,proxyw,frontw,nodew);

  //listen for revving, and then make nodes on command
  if(config.server.makenodes) {
    var sub=redis.createClient(config.redis);

    sub.subscribe('node.rev');
    sub.on('message',function(channel,message) {
      debug('rev received.  spawning %s nodes',nodew);
      for(var i=0;i<nodew;i++) {
        cluster.fork();
      }
      sub.quit();
    });
  }
  require('./master/dbcheck.js')(debug,knex).then(function() {
    for(var i=0;i<proxyw+frontw;i++) {
      cluster.fork();
    }
    //alright, rev it up
    if(config.server.rev) {
      debug('revving now.');
      //runs immediately because I want to be able to `node rev.js`
      require('./rev.js');
    }
  });
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
    require('./server')(debug,knex);
  }
}
