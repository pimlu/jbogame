var
  config=require('../config.js');

var inspect=require('util').inspect;

module.exports=function(debug,knex,sysname,sysid) {
  function addent(ents,ent) {
    ents[ent.id]=ent;
    if(!('ax' in ent)) ent.ax=ent.ay=ent.az=0;
    if(!('rax' in ent)) {
      //this is the null rotation right?
      ent.rax=ent.ray=ent.raz=0;
      ent.raw=1;
    }
    ent.players={};
    ent.fresh=false;//whether the buffer is updated
    ent.buffer=new ArrayBuffer(28);//placeholder length
  }
  function loadall(ents) {
    return knex('ents').where('systemid',sysid).whereRaw('coalesce("timer",-1) != 0')
    .then(function(rows) {
      debug.dbg(inspect(rows));
      for(var i=0;i<rows.length;i++) {
        addent(ents,rows[i]);
      }
    });
  }
  return {
    addent:addent,
    loadall:loadall
  };
};
