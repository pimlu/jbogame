
var config = require('../config.js'),
  _ = require('lodash'),
  inspect = require('util').inspect;

module.exports = Entity;

var ents = {};

//takes database rows as an argument
function Entity(ent) {
  ents[ent.id] = this;
  _.assign(this,ent);
  if (!('ax' in this)) this.ax = this.ay = this.az = 0;
  if (!('rax' in this)) {
    //this is the null rotation right?
    this.rax = this.ray = this.raz = 0;
    this.raw = 1;
  }
  this.chars = {};
  this.fresh = false; //whether the buffer is updated
  this.buffer = new ArrayBuffer(28); //placeholder length

}

Entity.ents = ents;

Entity.dotick = function(tick, dilation) {
  var keys = Object.keys(ents);
  for (var i = 0; i < keys.length; i++) {
    var ent = ents[keys[i]];
    ent.tick(tick, dilation);
  }
};

Entity.loadall = function() {
  var req=Entity.req;
  return req.knex('ents').where('systemid', req.id).whereRaw('coalesce("timer",-1) != 0')
    .then(function(rows) {
      for (var i = 0; i < rows.length; i++) {
        new Entity(rows[i]);
      }
    });
};

Entity.prototype = {

  //pushes a message to all chars inside an ent
  //arr is the key to whatever message buffer is needed
  broadcast: function(arr, msg) {
    var keys = Object.keys(this.chars);
    for (var i = 0; i < keys.length; i++) {
      var char=this.chars[keys[i]];
      //skip non-users (all users have numeric IDs)
      if(isNaN(char.id)) continue;
      char.state[arr].push(msg);
    }
  },

  //registers a char with this ent
  addchar: function(char) {
    this.chars[char.id] = char;
    //tell everyone a new char has joined
    broadcast(ent, 'joins', {
      join: true,
      id: char.id
    });
  },

  delchar: function(char) {
    delete this.chars[char.id];
    //tell everyone a char has left
    this.broadcast('joins', {
      join: false,
      id: char.id
    });
  },

  tick: function(tick, dilation) {

  }
};
