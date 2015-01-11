var
  config=require('../config.js'),
  redis=require('then-redis'),
  WSServer=require('./WSServer.js');

var inspect=require('util').inspect;
module.exports=function(debug,knex,rdcl,app,name) {
  var wss=new WSServer(app);
  wss.onconnect=function(ws) {
    ws.rel('server message');
    ws.onmessage(function(msg) {
      debug(inspect(msg));
    });
  };
  debug('doorman');
};
