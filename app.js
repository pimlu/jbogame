var
  config=require('./config.js'),
  _=require('lodash'),
  knex=require('knex')(config.knex),
  cluster = require('cluster');

var frontw=config.front.workers;
var worldw=_.size(config.game.worlds);
if(cluster.isMaster) {
  console.log('master opening '+frontw+' front workers, '
  +worldw+' world workers');
  require('./dbcheck.js')(knex).then(function() {
    for(var i=0;i<config.front.workers+worldw;i++) {
      cluster.fork();
    }
  });
} else {
  var id=cluster.worker.id;
  var front=id<=frontw;
  if(front) {
    console.log('worker '+id+': front');
    require('./front.js')(knex);
  } else {
    //loop through world keys (the world number) until the IDth key
    var i=frontw;
    for(var wnum in config.game.worlds) {
      if(++i===id) break;
    }
    var wcfg=config.game.worlds[wnum];
    console.log('worker '+id+': '+'world #'+wnum+' '+JSON.stringify(wcfg));
    //use the appropriate script to run the gameserver
    var script=config.game.types[wcfg[0]];
    require(script)(knex,wcfg);
  }
}
