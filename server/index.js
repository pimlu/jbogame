var
  config=require('../config.js'),
  http=require('http'),
  Promise=require('bluebird'),
  redis=require('then-redis'),
  sub=config.rdcl(redis),
  rdcl=config.rdcl(redis);

var inspect=require('util').inspect;

module.exports=function(debug,knex,id) {
  var reset,system;

  system=process.env.zdelu_system;
  debug=debug('cyan','system',system);
  process.title=system.replace(/ /g,'-');

  var app=http.createServer(handler),
    port=config.server.port+id;

  function handler(req,res) {
    res.writeHead(200);
    res.end(system);
  }
  var doorman=require('./doorman.js')(debug,knex,rdcl,app,system,connect);

  function connect(user,ws) {
    debug(inspect(user));
    var udata={
      entid:user.entid,
      cx:user.cx,cy:user.cy,cz:user.cz
    };
    if(!user.lastplayed) ws.rel('newplayer');
    //else udata.lastplayed=+user.lastplayed;
    debug(inspect(udata));
    ws.rel(udata);

    setTimeout(function() {
      ws.close(4001,'idle');
    },3000);
  }

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
