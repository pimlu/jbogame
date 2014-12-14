var
  config=require('../config.js'),
  http=require('http'),
  https=require('https'),
  express=require('express'),
  httpProxy=require('http-proxy');

module.exports=function(debug) {
  var port=config.proxy.port,
  ports=config.proxy.ports;
  //proxy for the frontend
  var frontproxy = new httpProxy.createProxyServer({
    target:{
      host:config.front.host,
      port:config.front.port
    },
    xfwd:true
  });
  //on http, redirect them to the https server
  var redirect=http.createServer(function(req,res) {
    res.writeHead(302, {
      'Location': 'https://'+req.headers.host.split(':')[0]
      +(ports===443?'':':'+ports)
      +req.url
    });
    res.end();
  });
  //right now only cares about frontproxy, may change
  var server = https.createServer(config.proxy.https(),function (req, res) {
    frontproxy.web(req, res);
  });
  server.on('upgrade', function (req, socket, head) {
    //TODO websocket code
  });
  redirect.listen(port);
  server.listen(ports);
  debug('listening at %s and %s.',port,ports);
};
