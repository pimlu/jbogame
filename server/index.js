var
  config=require('../config.js'),
  Promise=require('bluebird'),
  io = require('socket.io')(),
  redis=require('redis'),
  rdcl=Promise.promisifyAll(redis.createClient(config.redis));

var reset;
module.exports=function(debug,knex) {

  rdcl.incrAsync('nodeid').then(function(id) {
    setup(debug('cyan','node',id),id,config.server.port+id,knex);
  });
};
function setup(debug,id,port,knex) {
  debug('server running %s',JSON.stringify(port));
  io.on('connection', function(socket){
    debug('connect');
    socket.on('msg',function(msg) {
      debug('client says "%s"',msg);
      socket.emit('msg','server message');
    });
  });
  io.listen(port);
  debug('io listening at %s',port);
  reset=require('./setstatus.js')(debug,id,port,rdcl);
  loop();
}

function loop() {
  reset();
  setTimeout(loop,config.server.wdtime/2);
}
