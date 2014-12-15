var io = require('socket.io')();
module.exports=function(debug,wcfg,knex,redis,rdcl) {
  debug('commserve running');
  debug(JSON.stringify(wcfg));
  io.on('connection', function(socket){
    debug('connect\n%s',JSON.stringify(socket,null,4));
  });
  debug('io listening at %s',wcfg[1]);
  io.listen(wcfg[1]);
};
