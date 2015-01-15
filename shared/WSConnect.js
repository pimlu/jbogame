(function() {
  var server;
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
    if(!server) ws.binaryType='arraybuffer';
  }
  WSConnect.prototype.rel=WSConnect.prototype.urel=function(msg,ack) {
    if(typeof msg==='object') msg=BSON.serialize(msg,false,true,false);
    this.ws.send(msg,ack);
  };
  WSConnect.prototype.close=function(code,reason) {
    this.ws.close(code||1000,reason||'');
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
      var data=e.data;
      if(typeof data!=='string') {
        //make it into a typed array instead of a buffer if we're on the client
        if(!server) data=new Uint8Array(data);
        return cb(BSON.deserialize(data));
      }
      return cb(data);
    };
  };
  if(server) WSConnect.prototype.ip=function() {
    return this.ws.upgradeReq.headers['x-forwarded-for'];
  }
})();
