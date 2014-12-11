var
  config=require('./config.js'),
  _=require('lodash'),
  knex=require('knex')(config.knex),
  cluster = require('cluster'),
  debug=require('./debug.js');

var frontw=config.front.workers,
  cdw=config.cd.workers,
  worldw=_.size(config.game.worlds);
if(cluster.isMaster) {
  debug=debug('blue','master');
  debug('opening %s front workers, '+
  '%s cd workers, %s world workers',frontw,cdw,worldw);
  require('./dbcheck.js')(knex,debug).then(function() {
    for(var i=0;i<frontw+cdw+worldw;i++) {
      cluster.fork();
    }
  });
} else {
  var id=cluster.worker.id;
  if(id<=frontw) {
    debug=debug('green','front',id)
    debug('initializing');
    require('./front.js')(knex,debug);
  } else if(id<=frontw+cdw) {
    debug=debug('red','cd',id-frontw);
    debug('initializing');
    require('./cd.js')(debug);
  } else {
    //loop through world keys (the world number) until the IDth key
    var i=frontw+cdw;
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
