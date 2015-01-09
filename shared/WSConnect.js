(function() {
  var server;
  if(typeof define==='function') {
    server=false;
    define(['socketio'],impl);
  } else if(typeof module==='object') {
    server=true;
    var checkauth=require('../server/checkauth.js');
    module.exports=impl(require('socket.io'));
  }
  function WSConnect(io,name,app) {
    var self=this;
    this.io=io(app||'/',{path:'/system/'+system+'/socket.io'});
    if(server) {
      this.users={};
      this.io.on('connection',function(socket) {
        //they have ten seconds to auth before getting kicked
        var t=setTimeout(function() {
          socket.disconnect();
        },10e3);//give them a good ten seconds to auth
        function message(msg) {
          if(!checkauth(msg)) return;
          clearTimeout(t);
          var user=self.users[msg.id]={};
          user.id=msg.id;
          user.name=msg.name;
          user.socket=socket;
          if('onconnect' in self) self.onconnect();
        }
        socket.on('message',message);
      });
    }
  }
  //our actual implementation
  function impl(io) {
    return WSConnect.bind(null,io);
  }
})()
