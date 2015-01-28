var ws;

define(['WSClient'],function(WSClient) {
  function handshake(all,join,message,leave) {
    ws=new WSClient(all.state.system);

    //authenticate with the doorman
    ws.onopen(function() {
      ws.rel({id:all.session.id,token:all.state.token});
    });
    //
    ws.onmessage(function(msg) {
      if(msg!=='shook') return;//TODO better issue handling
      all.state.ws=ws;
      ws.onmessage(message);
      join();
    });
    ws.onclose(function(e) {
      leave(e);
    });
  }
  return handshake;
});
