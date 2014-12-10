var
  config=require('./config.js'),
  _=require('lodash'),
  knex=require('knex')(config.knex),
  cluster = require('cluster'),
  debug=require('./tridebug');

var frontw=config.front.workers,
  cdw=config.cd.workers,
  worldw=_.size(config.game.worlds);
if(cluster.isMaster) {
  require('debug').disable('express:*,send');
  debug=debug('master');
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
    console.log('worker %s: front',id);
    require('./front.js')(knex);
  } else if(id<=frontw+cdw) {
    console.log('worker %s: content delivery',id);
    require('./cd.js')();
  } else {
    //loop through world keys (the world number) until the IDth key
    var i=frontw+cdw;
    for(var wnum in config.game.worlds) {
      if(++i===id) break;
    }
    var wcfg=config.game.worlds[wnum];
    console.log('worker %s: '+'world #%s %s',id,wnum,JSON.stringify(wcfg));
    //use the appropriate script to run the gameserver
    var script=config.game.types[wcfg[0]];
    require(script)(knex,wcfg);
  }
}
