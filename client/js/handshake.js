var ws

define(['WSClient'],function(WSClient) {
  function handshake(data) {
    ws=new WSClient(data.system);

    ws.onopen(function() {
      console.log('open');
      ws.rel(data);
    });
    ws.onmessage(function(msg) {
      
    });
  }
  return handshake;
});
