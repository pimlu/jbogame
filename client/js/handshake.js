var ws;

define(['WSClient'],function(WSClient) {
  function handshake(all,join,message,leave) {
    ws=new WSClient(all.state.system);

    ws.onopen(function() {
      ws.rel({id:all.session.id,token:all.state.token});
    });
    ws.onmessage(function(data) {
      all.state.ws=ws;
      ws.onmessage(message);
      join(data);
    });
    ws.onclose(function(e) {
      leave(e);
    });
  }
  return handshake;
});
