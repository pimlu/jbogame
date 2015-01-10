define(['WSClient'],function(WSClient) {
  function handshake(data) {
    var ws=new WSClient(data.name);
  }
  return handshake;
});
