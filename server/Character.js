var config = require('../config.js'),
  _ = require('lodash'),
  inspect = require('util').inspect,
  Entity = require('./Entity.js');

module.exports = Character;


function Character(id, ent, x, y, z, user) {
  this.id = id;
  this.ent = ent;
  this.x = x;
  this.y = y;
  this.z = z;
  this.user = user || null;
  ent.addchar(this);
}

Character.prototype = {
  del: function() {
    this.ent.delchar(this);
  },
  //doesn't refer to del because special logic may happen when a char is
  //legitimately destroyed
  move: function(ent) {
    delete this.ent.chars[this.id];
    this.ent = ent;
    ent.chars[name] = this;
  }
};
