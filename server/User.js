var config = require('../config.js'),
  _ = require('lodash'),
  inspect = require('util').inspect,
  Entity = require('./Entity.js'),
  Character = require('./Character.js');

var minupdate = config.server.cl.minupdate;

module.exports = User;

var users = {};

function User(data, ws) {
  users[data.id] = this;
  _.assign(this, {
    //data.char will exist if data instanceof User, else data will be SQL rows
    char: data.char || new Character(data.name, Entity.ents[data.entid],
      data.cx, data.cy, data.cz),
    id: data.id,
    name: data.name,
    ws: ws,
    fresh: true,
    logstatus: {
      safelog: false,
      timeout: null,
      stamp: null
    },
    state: {
      connects: [],
      joins: []
    }
  });
  ws.onclose(this.close.bind(this));
}

User.users = users;
//keeping track of the state of users should be separate from
//sending state to him
User.connect = function(data, ws) {
  var user, olduser;

  //they just reconnected, stop the countdown
  if (data.id in users) {
    olduser = chars[data.id];
    clearTimeout(olduser.logstatus.timeout);
    //if, on the contrary, they are still connected, sack the old one
    if (olduser.ws.isopen()) {
      /*don't go crazy with disconnect handling if someone else is now
      in charge- this way, the timeout doesn't start after the close
      event asynchronously triggers*/
      olduser.ws.onclose(function() {});
      olduser.ws.close(4001, 'another client has logged in as you');
    }
    user = new User(olduser, ws);
  } else {
    user = new User(data, ws);
  }

  //TODO more connect types
  user.state.connects.push({
    cnct: true,
    id: user.id,
    name: user.name
  });
}

User.updatestate = function(tick, dilation) {
  if (tick % minupdate !== 0) return;

  /*using a for-in loop on an object in hashtable mode will cause function
  depotimization in current v8, thus Object.keys is used here instead.
  this type of loop will be common*/
  var keys = Object.keys(users);
  for (var i = 0; i < keys.length; i++) {
    var user = users[keys[i]];
    //if they're not connected, skip
    if (!user.ws.isopen()) continue;
    if (user.fresh) user.fill(tick, dilation);
    user.update(tick, dilation);
  }
}

User.prototype = Object.create(Character.prototype);
_.assign(User.prototype, {

  fill: function(tick, dilation) {
    this.fresh = false;
    var udata = {
      lastplayed: 0
    };
    if (this.lastplayed) udata.lastplayed = this.lastplayed = +this.lastplayed;
    User.req.debug.dbg('sending udata', inspect(udata));
    this.ws.rel(udata);
  },

  update: function(tick, dilation) {
    var udata = {
      tick: tick,
      dil: dilation
    };
    //tell the user about any new (dis)connections, if there is any
    if (this.state.connects.length !== 0) {
      udata.cncts = this.state.connects;
      this.state.connects = [];
    }
    this.ws.rel(udata);
  },

  //called when a user's websocket is closed. doesn't imply deletion of
  //the user/character- it sets a timeout instead with startlog
  close: function(code, reason) {
    var keys = Object.keys(users);
    for (var i = 0; i < keys.length; i++) {
      var curuser = users[keys[i]];
      if (curuser !== this) curuser.state.connects.push({
        cnct: false,
        id: this.id,
        name: this.name
      });
    }
    if (this.logstatus.safelog) {
      //if they quit early while safe logging
      if (this.timeout !== null) {
        this.startlog(false);
      }
    } else {
      this.startlog(false);
    }
  },

  startlog: function(safe) {
    //TODO better debug referencing system
    User.req.debug.dbg('start %s %s', this.id, safe);
    var ls = this.logstatus;
    //if safe, they're still connected.  else their ws died
    if (safe) ls.safelog = true;
    ls.timeoutstamp = (+new Date) + 15e3;
    ls.timeout = setTimeout(function() {
      User.req.debug.dbg('finish %s', this.id, safe);
      ls.timeout = null;
      //well, they're safe now
      ls.safelog = true;
      if (this.ws.isopen()) this.ws.close(4002);
      //TODO ent deletion handling
      this.char.del();
      delete users[this.id];
    }.bind(this), 15e3);
  }
});
