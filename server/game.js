var
config=require('../config.js'),
Promise=require('bluebird'),
redis=require('then-redis');

var inspect=require('util').inspect;


var sysid,
  sysname,
  ents={};

module.exports=function(debug,knex,rdcl,sysname_,feed) {

  sysname=sysname_;

  //placeholder game loop for now
  setInterval(feed,config.server.wdtime/2);

  function connect(user,ws) {
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

  return knex('systems').select('id').where('name',sysname).then(function(row) {
    sysid=row[0].id;
    return knex('ents').where('systemid',sysid).whereRaw('coalesce("timer",-1) != 0');
  }).then(function(rows) {
    //fill the server state with all the ents which should be there
    debug.dbg(inspect(rows));
    for(var i=0;i<rows.length;i++) {
      ents[i]=rows[i];
      ents[i].players={};
      ents[i].fresh=false;//whether the buffer is updated
      ents[i].buffer=new ArrayBuffer(28);//placeholder length
    }
    return connect;
  });
};
