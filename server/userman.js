var
config=require('../config.js');

var inspect=require('util').inspect;

module.exports=function(debug,knex,sysname,sysid) {
  //keeping track of the state of users should be separate from
  //sending state to him
  function connect(users,user,ws) {

    adduser(users,user,ws);
  }
  function close(users,user,code,reason) {
    if(user.safelog) {
      //if they quit early while safe logging
      if(user.timeout!==null) {
        startlog(users,user,false);
      }
    } else {
      startlog(users,user,false);
    }
  }
  //to be exported to userman
  function adduser(users,user,ws) {
    if(user.id in users) {
      user=users[user.id];
      clearTimeout(user.timeout);
      user.timeout=null;
    } else {
      users[user.id]=user;
      user.safelog=false;
      user.timeout=null;
      user.timeoutstamp=null;
    }
    user.ws=ws;
  }
  function deluser(users,user) {
    delete users[user.id];
  }
  function startlog(users,user,safe) {
    debug.dbg('start %s %s',user.id,safe);
    if(safe) user.safelog=true;
    user.timeoutstamp=(+new Date)+5e3;
    user.timeout=setTimeout(function() {
      debug.dbg('finish %s',user.id,safe);
      user.timeout=null;
      //well, they're safe now
      user.safelog=true;
      user.ws.close(4002);
      deluser(users,user);
    },5e3);
  }

  return {
    connect:connect,
    close:close,
    adduser:adduser,
    startlog:startlog
  };
};
