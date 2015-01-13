var ws;

define(['WSClient'],function(WSClient) {
  function handshake(all,join,leave) {
    ws=new WSClient(all.state.system);

    ws.onopen(function() {
      console.log('open');
      ws.rel({id:all.session.id,token:all.state.token});
    });
    ws.onmessage(function(msg) {
      all.state.ws=ws;
      if(msg==='success') join();
    });
    ws.onclose(function(e) {
      leave(e);
    });
  }
  return handshake;
});
