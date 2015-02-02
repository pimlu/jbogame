//now all we need is an excuse for a -der suffix
var
  config = require('../config.js');

var inspect = require('util').inspect;

module.exports = function(debug, knex, sysname, sysid, chars) {

  function addchar(char) {
    chars[char.id] = char;
  }

  function delchar(char) {
    delete chars[char.id];
  }
  return {
    chars: chars,
    addchar: addchar,
    delchar: delchar
  };
};