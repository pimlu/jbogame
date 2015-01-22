var
  config=require('../config.js'),
  Promise=require('bluebird'),
  redis=require('then-redis'),
  THREE=require('three');

var inspect=require('util').inspect;


var sysid,
  sysname,
  users={},
  ents={},
  step=config.server.cl.step;

var timer=require('./looptimer.js'),
  phys=require('../shared/phys.js')(THREE,step),
  modstate=require('./modstate.js');

var debug,knex,rdcl,feed;

module.exports=function(debug_,knex_,rdcl_,sysname_,feed_) {
  debug=debug_;
  knex=knex_;
  rdcl=rdcl_;
  sysname=sysname_;
  feed=feed_;

  return knex('systems').select('id').where('name',sysname).then(function(row) {
    sysid=row[0].id;
    modstate=modstate(debug,knex,sysname,sysid);
    return modstate.loadall(ents);
  }).then(function() {
    timer(debug,feed,loop);
    return connect;
  });
};

function connect(user,ws) {

  ws.onclose(function(e) {
    close(user,e.code,e.reason);
  });
  debug.dbg('user',inspect(user));
  if(user.id in users) {
    //nothing yet
  } else {
    users[user.id]=user;
  }
  var udata={
    entid:user.entid,
    cx:user.cx,cy:user.cy,cz:user.cz,
    lastplayed:0
  };
  if(user.lastplayed) udata.lastplayed=user.lastplayed=+user.lastplayed;
  debug.dbg('sending udata',inspect(udata));
  ws.rel(udata);

  setTimeout(function() {
    ws.close(4001,'idle');
  },60000);
};

function close(user,code,reason) {
  debug.dbg('close %s %s %s',user.id,code,reason);
}

//actual game logic in here
function loop(dilation) {
  //debug.dbg(dilation);
}
