var WebSocketServer = require('ws').Server,
  WSConnect = require('../shared/WSConnect.js');

function WSServer(server) {
  var self = this;
  this.wss = new WebSocketServer({
    server: server
  });
  this.wss.on('connection', function(ws) {
    if ('onconnect' in self) self.onconnect(new WSConnect(ws));
  });
}
WSServer.prototype.broadcast = function(msg) {

};

module.exports = WSServer;