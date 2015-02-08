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
    mans.entman.addchar(char);
  }

  function delchar(char) {
    mans.entman.delchar(char);
    delete chars[char.id];
  }
  return charman;
};
