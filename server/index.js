var
  config=require('../config.js'),
  Promise=require('bluebird'),
  io = require('socket.io')(),
  redis=require('redis'),
  sub=redis.createClient(config.redis),
  rdcl=Promise.promisifyAll(redis.createClient(config.redis));

var reset;
module.exports=function(debug,knex) {
  //when we receive our unique ID...
  rdcl.incrAsync('nodeid').then(function(id) {
    //subscribe to that ID's rev channel...
    sub.subscribe('rev.'+id);
    //TODO use promise. having some weird problem with errors. then-redis time?
    sub.on('message',function(channel,plan) {
      //so we receive the plan with our systems when rev finishes
      setup(debug('cyan','node',id),knex,
        config.server.port+id,id,JSON.parse(plan));
    });
  });
};
function setup(debug,knex,port,id,plan) {
  debug('server running %s',JSON.stringify(port));
  debug('I am responsible for %s',JSON.stringify(plan));
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
