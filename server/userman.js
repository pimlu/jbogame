var
  config=require('../config.js');

var inspect=require('util').inspect;

module.exports=function(debug,knex,sysname,sysid,charman) {
  //keeping track of the state of users should be separate from
  //sending state to him
  function connect(user,ws) {
    charman.addchar(user,ws);
  }
  function close(user,code,reason) {
    if(user.safelog) {
      //if they quit early while safe logging
      if(user.timeout!==null) {
        startlog(user,false);
      }
    } else {
      startlog(user,false);
    }
  }
  function startlog(user,safe) {
    debug.dbg('start %s %s',user.id,safe);
    if(safe) user.safelog=true;
    user.timeoutstamp=(+new Date)+5e3;
    user.timeout=setTimeout(function() {
      debug.dbg('finish %s',user.id,safe);
      user.timeout=null;
      //well, they're safe now
      user.safelog=true;
      user.ws.close(4002);
      charman.delchar(user);
    },5e3);
  }

  return {
    connect:connect,
    close:close,
    startlog:startlog
  };
};
