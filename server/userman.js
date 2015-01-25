var
  config=require('../config.js');

var inspect=require('util').inspect;

module.exports=function(debug,knex,sysname,sysid,charman) {
  var chars=charman.chars;
  //keeping track of the state of users should be separate from
  //sending state to him
  function connect(user,ws) {
    //they just reconnected, stop the countdown
    if(user.id in chars) {
      user=chars[user.id];
      clearTimeout(user.timeout);
    } else {
      charman.addchar(user);
    }
    //TODO is fresh the right way to go about this?
    user.fresh=true;

    user.safelog=false;
    user.timeout=null;
    user.timeoutstamp=null;

    user.ws=ws;
    user.state={};
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

  function updatestate(tick,dilation) {
    /*using a for-in loop on an object in hashtable mode will cause function
    depotimization in current v8, thus Object.keys is used here instead.
    this type of loop will be common*/
    var keys=Object.keys(chars);
    for(var i=0;i<keys.length;i++) {
      //TODO maintain list of users
      if(!/^[0-9]+$/.test(keys[i])) continue;
      var user=chars[keys[i]];
      if(user.fresh) filluser(user,tick,dilation);
      else updateuser(user,tick,dilation);
    }
  }

  function filluser(user,tick,dilation) {
    user.fresh=false;
    var udata={
      entid:user.entid,
      cx:user.cx,cy:user.cy,cz:user.cz,
      lastplayed:0,
      tick:tick,
      dil:dilation
    };
    if(user.lastplayed) udata.lastplayed=user.lastplayed=+user.lastplayed;
    debug.dbg('sending udata',inspect(udata));
    user.ws.rel(udata);
  }

  function updateuser(user,tick,dilation) {

  }

  return {
    connect:connect,
    close:close,
    startlog:startlog,
    updatestate:updatestate
  };
};
