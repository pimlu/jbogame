define(['WSConnect'],function(WSConnect) {
  function WSClient(name) {
    var ws=new WebSocket('http://127.0.0.1/system/'+name);
    return new WSConnect(ws);
  }
  return WSClient;
});
