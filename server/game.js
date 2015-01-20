var
config=require('../config.js'),
Promise=require('bluebird'),
redis=require('then-redis');

var inspect=require('util').inspect;

module.exports=function(debug,knex,rdcl,feed) {
  //placeholder game loop for now
  setInterval(feed,config.server.wdtime/2);

  return function connect(user,ws) {
    debug('user',inspect(user));
    var udata={
      entid:user.entid,
      cx:user.cx,cy:user.cy,cz:user.cz,
      lastplayed:0
    };
    if(user.lastplayed) udata.lastplayed=+user.lastplayed;
    debug('sending udata',inspect(udata));
    ws.rel(udata);

    setTimeout(function() {
      ws.close(4001,'idle');
    },60000);
  };
};
