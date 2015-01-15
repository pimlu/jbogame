var
  config=require('../config.js'),
  Promise=require('bluebird'),
  redis=require('then-redis'),
  WSServer=require('./WSServer.js');

module.exports=function(debug,knex,rdcl,app,name,cb) {
  var wss=new WSServer(app);
  var pending={};
  wss.onconnect=function(ws) {
    var t=setTimeout(ws.close.bind(ws,'handshake timeout'),10000);
    ws.onmessage(function(msg) {
      ws.onmessage(function(){});

      var match=true,user;
      //TODO validation?
      //check if the credentials match
      var key='user:'+msg.id;
      Promise.all([
        rdcl.get(key+':token').then(function(token) {
          if(token!==msg.token) match=false;
        }),
        rdcl.get(key+':system').then(function(system) {
          if(system!==name) match=false;
        }),
        //grab user data for the callback
        knex('users').where('id',msg.id).then(function(row) {
          user=row[0];
        })
      ]).then(function() {
        //stop the countdown, update users b/c of login, and do callback
        clearTimeout(t);
        if(!match) return ws.close('handshake invalid');
        ws.rel('success');
        var change={lastplayed:knex.raw('now()'),lastip:ws.ip()};
        return knex('users').update(change).where('id',msg.id);
      }).then(function() {
        cb(user,ws);
      });
    });
  };
  debug('doorman');
};
