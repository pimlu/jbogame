//now all we need is an excuse for a -der suffix
var config = require('../config.js');

var inspect = require('util').inspect;

module.exports = function(debug, knex, sysname, sysid, mans, chars) {
  var charman = mans.charman = {
    chars: chars,
    addchar: addchar,
    delchar: delchar
  };

  function addchar(char) {
    chars[char.id] = char;
    //debug(inspect(Object.keys(mans.entman.ents)));
    //debug(char.entid);
    //FIXME
    //mans.entman.ents[char.entid].chars[char.id] = char;
  }

  function delchar(char) {
    //FIXME
    //delete mans.entman.ents[char.entid].chars[char.id];
    delete chars[char.id];
  }
  return charman;
};
