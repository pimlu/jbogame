var
  config=require('../config.js'),
  http=require('http'),
  Promise=require('bluebird'),
  redis=require('then-redis'),
  sub=config.rdcl(redis),
  rdcl=config.rdcl(redis);

module.exports=function(debug,knex,id) {
  var reset,system;

  system=process.env.zdelu_system;
  debug=debug('cyan',system);

  var app=http.createServer(handler),
    io = require('socket.io')(app,{path:'/system/'+system+'/socket.io'}),
    port=config.server.port+id;

  function handler(req,res) {
    res.writeHead(200);
    res.end(system);
  }

  io.on('connection', function(socket){
    debug('connect');
    socket.on('msg',function(msg) {
      debug('client says "%s"',msg);
      socket.emit('msg','server message');
    });
  });
  app.on('listening',function() {
    debug('io listening at %s',port);
    reset=require('./setstatus.js')(debug,system,port,rdcl);
    loop();
  });
  app.listen(port);


  function loop() {
    reset();
    setTimeout(loop,config.server.wdtime/2);
  }
}
