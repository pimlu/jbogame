(function() {
  var server,BSON;
  if(typeof define==='function') {
    server=false;
    define(['bson'],function(bson_) {
      BSON=bson_().BSON;
      return WSConnect;
      });
  } else if(typeof module==='object') {
    server=true;
    BSON=require('bson').BSONPure.BSON;
    module.exports=WSConnect;
  }
  function WSConnect(ws) {
    this.ws=ws;
  }
  WSConnect.prototype.rel=WSConnect.prototype.urel=function(msg,ack) {
    if(typeof msg==='object') msg=BSON.serialize(msg,false,true,false);
    this.ws.send(msg,ack);
  };
  WSConnect.prototype.close=function(reason) {
    this.ws.close(1000,reason);
  };
  WSConnect.prototype.onopen=function(cb) {
    this.ws.onopen=cb;
  };
  WSConnect.prototype.onclose=function(cb) {
    this.ws.onclose=cb;
  };
  WSConnect.prototype.onerror=function(cb) {
    this.ws.onerror=cb;
  };
  WSConnect.prototype.onmessage=function(cb) {
    this.ws.onmessage=function(e) {
      if(typeof e.data!=='string') return cb(BSON.deserialize(e.data));
      return cb(e.data);
    };
  };
  if(server) WSConnect.prototype.ip=function() {
    return this.ws.upgradeReq.headers['x-forwarded-for'];
  }
})();
