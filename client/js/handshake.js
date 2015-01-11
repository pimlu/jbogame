var ws

define(['WSClient'],function(WSClient) {
  function handshake(data) {
    ws=new WSClient(data.system);

    ws.onopen(function() {
      console.log('open');
      ws.rel({id:data.id,token:data.token});
    });
    ws.onmessage(function(msg) {
      console.log(msg);
    });
    ws.onclose(function(e) {
      console.log('close',e);
    });
  }
  return handshake;
});
