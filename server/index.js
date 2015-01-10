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
    port=config.server.port+id;

  function handler(req,res) {
    res.writeHead(200);
    res.end(system);
  }
  var doorman=require('doorman')(debug,knex,rdcl,system);

  app.on('listening',function() {
    debug('app listening at %s',port);
    reset=require('./setstatus.js')(debug,system,port,rdcl);
    loop();
  });
  app.listen(port);


  function loop() {
    reset();
    setTimeout(loop,config.server.wdtime/2);
  }
}
