var config = require('../config.js'),
  _ = require('lodash'),
  inspect = require('util').inspect,
  Entity = require('./Entity.js');

module.exports = Character;


function Character(id, ent, x, y, z) {
  this.id = id;
  this.ent = ent;
  ent.chars[id] = this;
  this.x = x;
  this.y = y;
  this.z = z;
}

Character.prototype = {
  del: function() {
    delete this.ent.chars[this.id];
  },
  //doesn't refer to del because special logic may happen when a char is
  //legitimately destroyed
  move: function(ent) {
    delete this.ent.chars[this.id];
    this.ent = ent;
    ent.chars[name] = this;
  }
};
