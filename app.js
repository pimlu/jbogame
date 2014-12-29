var
  config=require('./config.js'),
  _=require('lodash'),
  knex=require('knex')(config.knex),
  cluster = require('cluster'),
  debug=require('./debug.js');

var proxyw=config.proxy.workers,
  frontw=config.front.workers,
  worldw=_.size(config.server.worlds);

if(cluster.isMaster) {
  debug=debug('blue','master');
  debug('opening %s proxy workers, %s front workers, '+
  '%s world workers',proxyw,frontw,worldw);
  require('./master/dbcheck.js')(knex,debug).then(function() {
    for(var i=0;i<proxyw+frontw+worldw;i++) {
      cluster.fork();
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
    //loop through world keys (the world number) until the IDth key
    var i=proxyw+frontw;
    for(var wnum in config.server.worlds) {
      if(++i===id) break;
    }
    var wcfg=config.server.worlds[wnum].splice(0);
    wcfg.push(wnum);
    debug=debug('cyan','world',wnum);
    //use the appropriate script to run the gameserver
    var script=config.server.types[wcfg[0]];
    require(script)(debug,wcfg,knex);
  }
}
