var config = require('../config.js');

var minupdate = config.server.cl.minupdate;

var inspect = require('util').inspect;

var CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3;
module.exports = function(debug, knex, sysname, sysid, mans, users) {

  var userman = mans.userman = {
    users: users,
    connect: connect,
    close: close,
    startlog: startlog,
    updatestate: updatestate
  };

  var charman = mans.charman;
  var chars = charman.chars;

  //keeping track of the state of users should be separate from
  //sending state to him
  function connect(user, ws) {

    //TODO is fresh the right way to go about this?
    user.fresh = true;

    user.safelog = false;
    user.timeout = null;
    user.timeoutstamp = null;

    user.ws = ws;
    //filled with buffers of critical changes that can't be skipped
    user.state = {
      connects: [],
      joins: []
    };

    //they just reconnected, stop the countdown
    if (user.id in chars) {
      user = chars[user.id];
      clearTimeout(user.timeout);
      //if, on the contrary, they are still connected, sack the old one
      if (user.ws.isopen()) {
        /*don't go crazy with disconnect handling if someone else is now
        in charge- this way, the timeout doesn't start after the close
        event asynchronously triggers*/
        user.ws.onclose(function() {});
        user.ws.close(4001, 'another client has logged in as you');
      }
    } else {
      charman.addchar(user);
      users[user.id] = user;
      //get rid of their pass so I can't accidentally leak it or something
      user.pass = null;
    }

    /*add to the list of connections so that our newly connected user learns
    about everyone else, and everyone else learns about him*/
    //TODO make it so that this looks at your friends list, not the ent
    //FIXME use new broadcast system
    var keys = Object.keys(users);
    for (var i = 0; i < keys.length; i++) {
      var curuser = users[keys[i]];
      if (user.entid !== curuser.entid) continue;
      user.state.connects.push({
        cnct: true,
        id: curuser.id,
        name: curuser.name
      });
      if (curuser !== user) curuser.state.connects.push({
        cnct: true,
        id: user.id,
        name: user.name
      });
    }
  }

  function close(user, code, reason) {
    var keys = Object.keys(users);
    for (var i = 0; i < keys.length; i++) {
      var curuser = users[keys[i]];
      if (curuser !== user) curuser.state.connects.push({
        cnct: false,
        id: user.id,
        name: user.name
      });
    }
    if (user.safelog) {
      //if they quit early while safe logging
      if (user.timeout !== null) {
        startlog(user, false);
      }
    } else {
      startlog(user, false);
    }
  }

  function startlog(user, safe) {
    debug.dbg('start %s %s', user.id, safe);
    //if safe, they're still connected.  else their ws died
    if (safe) user.safelog = true;
    user.timeoutstamp = (+new Date) + 15e3;
    user.timeout = setTimeout(function() {
      debug.dbg('finish %s', user.id, safe);
      user.timeout = null;
      //well, they're safe now
      user.safelog = true;
      if (user.ws.isopen()) user.ws.close(4002);
      charman.delchar(user);
      delete users[user.id];
    }, 15e3);
  }

  function updatestate(tick, dilation) {
    if (tick % minupdate !== 0) return;

    /*using a for-in loop on an object in hashtable mode will cause function
    depotimization in current v8, thus Object.keys is used here instead.
    this type of loop will be common*/
    var keys = Object.keys(users);
    for (var i = 0; i < keys.length; i++) {
      var user = users[keys[i]];
      //if they're not connected, skip
      if (!user.ws.isopen()) continue;
      if (user.fresh) filluser(user, tick, dilation);
      updateuser(user, tick, dilation);
    }
  }

  function filluser(user, tick, dilation) {
    user.fresh = false;
    var udata = {
      lastplayed: 0
    };
    if (user.lastplayed) udata.lastplayed = user.lastplayed = +user.lastplayed;
    debug.dbg('sending udata', inspect(udata));
    user.ws.rel(udata);
  }

  function updateuser(user, tick, dilation) {
    var udata = {
      tick: tick,
      dil: dilation
    };
    //tell the user about any new (dis)connections, if there is any
    if (user.state.connects.length !== 0) {
      udata.cncts = user.state.connects;
      user.state.connects = [];
    }
    user.ws.rel(udata);
  }

  return userman;
};
