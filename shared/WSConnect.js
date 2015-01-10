(function() {
  var server;
  if(typeof define==='function') {
    server=false;
    define(function(){return WSConnect});
  } else if(typeof module==='object') {
    server=true;
    module.exports=WSConnect;
  }
  function WSConnect(ws) {
    this.ws=ws;
  }
  WSConnect.prototype.rel=function(msg) {
    this.ws.send(msg);
  };
  WSConnect.prototype.urel=function(msg) {
    this.ws.send(msg);
  };
  WSConnect.prototype.close=function() {
    this.ws.close();
  };
  WSConnect.prototype.onopen=function(cb) {
    this.ws.onopen=cb;
  };
  WSConnect.prototype.onmessage=function(cb) {
    this.ws.onmessage=cb;
  };
})();
