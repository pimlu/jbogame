(function() {
  var server;
  if(typeof define==='function') {
    server=false;
    define([],impl);
  } else if(typeof module==='object') {
    server=true;
    module.exports=WSConnect;
  }
  function WSConnect(ws) {
    this.ws=ws;
  }
  WSConnect.prototype.on=function(event,cb) {
    this.ws.on(event,cb);
    return this;
  };
  WSConnect.prototype.removeListener=function(event) {
    this.ws.removeListener(event);
    return this;
  };
  WSConnect.prototype.removeAllListeners=function(event) {
    this.ws.removeAllListeners(event);
    return this;
  };
  WSConnect.prototype.rel=function(msg) {
    this.ws.send(msg);
  };
  WSConnect.prototype.urel=function(msg) {
    this.ws.send(msg);
  };
})();
