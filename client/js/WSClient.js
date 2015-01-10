define(['WSConnect'],function(WSConnect) {
  function WSClient(name) {
    var url='wss://'+window.location.host+'/system/'+name;
    var ws=new WebSocket(url);
    return new WSConnect(ws);
  }
  return WSClient;
});
