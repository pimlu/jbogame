var
  config = require('../config.js'),
  http = require('http'),
  Promise = require('bluebird'),
  redis = require('then-redis'),
  sub = config.rdcl(redis),
  rdcl = config.rdcl(redis);

/*http/proxy/express level stuff goes here, game logic in game.js.
handshake process goes in doorman, doorman's connect event is passed to game.js
*/

module.exports = function(debug, knex, id) {
  var reset, system;

  system = process.env.zdelu_system;
  debug = debug('cyan', 'system', system);
  process.title = system.replace(/ /g, '-');

  var app = http.createServer(handler),
    port = config.server.port + id;

  var connect, doorman;

  function handler(req, res) {
    res.writeHead(200);
    res.end(system);
  }

  app.on('listening', function() {
    debug('app listening at %s', port);
  });
  feed = require('./setstatus.js')(debug, system, port, rdcl);
  require('./game.js')(debug, knex, rdcl, system, feed).then(function(connect_) {
    connect = connect_;
    doorman = require('./doorman.js')(debug, knex, rdcl, app, system, connect);
    app.listen(port);
  });
}