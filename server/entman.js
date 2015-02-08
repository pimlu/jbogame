var config = require('../config.js');

var inspect = require('util').inspect;

module.exports = function(debug, knex, sysname, sysid, mans, ents) {

  var entman = mans.entman = {
    ents: ents,
    addent: addent,
    broadcast: broadcast,
    addchar: addchar,
    delchar: delchar,
    loadall: loadall,
    dotick: dotick
  };

  function addent(ent) {
    ents[ent.id] = ent;
    if (!('ax' in ent)) ent.ax = ent.ay = ent.az = 0;
    if (!('rax' in ent)) {
      //this is the null rotation right?
      ent.rax = ent.ray = ent.raz = 0;
      ent.raw = 1;
    }
    ent.chars = {};
    ent.fresh = false; //whether the buffer is updated
    ent.buffer = new ArrayBuffer(28); //placeholder length
  }

  //pushes a message to all chars inside an ent
  //arr is the key to whatever message buffer is needed
  //TODO system of ignoring non-users
  function broadcast(ent, arr, msg) {
    var keys = Object.keys(ent.chars);
    for (var i = 0; i < keys.length; i++) {
      ent.chars[keys[i]].state[arr].push(msg);
    }
  }

  //registers a char with this ent
  function addchar(char) {
    var ent = ents[char.entid];
    ent.chars[char.id] = char;
    //tell everyone a new char has joined
    broadcast(ent, 'joins', {
      join: true,
      id: char.id
    });
  }

  function delchar(char) {
    var ent = ents[char.entid];
    delete ent.chars[char.id];
    //tell everyone a char has left
    broadcast(ent, 'joins', {
      join: false,
      id: char.id
    });
  }

  function loadall() {
    return knex('ents').where('systemid', sysid).whereRaw('coalesce("timer",-1) != 0')
      .then(function(rows) {
        for (var i = 0; i < rows.length; i++) {
          addent(rows[i]);
        }
      });
  }

  function dotick(tick, dilation) {
    var keys = Object.keys(ents);
    for (var i = 0; i < keys.length; i++) {
      var ent = ents[keys[i]];
      tickent(tick, dilation, ent);
    }
  }

  function tickent(tick, dilation, ent) {

  }
  return entman;
};
