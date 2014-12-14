var
  config=require('./config.js'),
  _=require('lodash'),
  knex=require('knex')(config.knex),
  cluster = require('cluster'),
  debug=require('./debug.js');

var proxyw=config.proxy.workers,
  frontw=config.front.workers,
  worldw=_.size(config.game.worlds);
if(cluster.isMaster) {
  debug=debug('blue','master');
  debug('opening %s proxy workers, %s front workers, '+
  '%s world workers',proxyw,frontw,worldw);
  require('./dbcheck.js')(knex,debug).then(function() {
    for(var i=0;i<proxyw+frontw+worldw;i++) {
      cluster.fork();
    }
  });
} else {
  var id=cluster.worker.id;
  if(id<=proxyw) {
    debug=debug('magenta','proxy',id);
    debug('initializing');
    require('./proxy')(debug);
  } else if(id<=proxyw+frontw) {
    debug=debug('green','front',id-proxyw);
    debug('initializing');
    require('./front')(knex,debug);
  } else {
    //loop through world keys (the world number) until the IDth key
    var i=proxyw+frontw;
    for(var wnum in config.game.worlds) {
      if(++i===id) break;
    }
    var wcfg=config.game.worlds[wnum];
    debug=debug('cyan','world',wnum);
    debug('initializing %s',JSON.stringify(wcfg));
    //use the appropriate script to run the gameserver
    var script=config.game.types[wcfg[0]];
    require(script)(knex,debug,wcfg);
  }
}
