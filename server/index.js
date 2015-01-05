var
  config=require('../config.js'),
  Promise=require('bluebird'),
  io = require('socket.io')(),
  redis=require('then-redis'),
  sub=redis.createClient(config.redis),
  rdcl=redis.createClient(config.redis);

var reset;
module.exports=function(debug,knex) {
  //when we receive our unique ID...
  rdcl.incr('nodeid').then(function(id) {
    debug=debug('cyan','node',id);
    debug('just spawned, received id');
    //subscribe to that ID's rev channel...
    sub.subscribe('node.plan');
    return new Promise(function(resolve,reject) {
      //...and grab the plan when the revver tells us it's ready
      sub.on('message',function(channel,msg) {
        //we've gotten our one and only message, quit and move on
        sub.quit();
        resolve(rdcl.smembers('node:'+id+':plan'));
      });
    }).then(function(plan) {
      setup(debug,knex,
        config.server.port+id,id,plan.map(Number));
    });
  })
};
//runs after allocation has figured everything out for us
function setup(debug,knex,port,id,plan) {
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
