//now all we need is an excuse for a -der suffix
var
  config=require('../config.js');

var inspect=require('util').inspect;

module.exports=function(debug,knex,sysname,sysid,chars) {

  function addchar(char,ws) {
    if(char.id in chars) {
      char=chars[char.id];
      clearTimeout(char.timeout);
      char.timeout=null;
    } else {
      chars[char.id]=char;
      char.safelog=false;
      char.timeout=null;
      char.timeoutstamp=null;
    }
    char.state={};
    char.ws=ws;
  }
  function delchar(char) {
    delete chars[char.id];
  }
  return {
    addchar:addchar,
    delchar:delchar
  };
};
