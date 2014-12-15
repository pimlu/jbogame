var
  config=require('../config.js'),
  io = require('socket.io')(),
  redis=require('redis'),
  rdcl=redis.createClient(config.redis);

var reset;
module.exports=function(debug,wcfg,knex) {
  debug('server running %s',JSON.stringify(wcfg));
  io.on('connection', function(socket){
    debug('connect');
  });
  io.listen(wcfg[1]);
  reset=require('./setstatus.js')(debug,wcfg[2],wcfg[0],wcfg[1],redis,rdcl);
  setTimeout(loop,500);
  debug('io listening at %s',wcfg[1]);
};

function loop() {
  reset();
  setTimeout(loop,config.server.wdtime/2);
}
