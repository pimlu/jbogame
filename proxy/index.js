var
  config=require('../config.js'),
  http=require('http'),
  https=require('https'),
  express=require('express'),
  httpProxy=require('http-proxy');

module.exports=function(debug) {
  var port=config.proxy.port,
  ports=config.proxy.ports;
  //on http, redirect them to the https server
  var redirect=http.createServer(function(req,res) {
    res.writeHead(302, {
      'Location':'https://'+req.headers.host.split(':')[0]
      +(ports===443?'':':'+ports)
      +req.url
    });
    res.end();
  });
  //proxy for the frontend
  var frontproxy=new httpProxy.createProxyServer({
    target:{
      host:config.front.host,
      port:config.front.port
    },
    xfwd:true
  });
  //setup proxy array for worlds
  var getstatus=require('../server/getstatus.js');
  var status=getstatus.status,
    proxies=[];
  getstatus.change=function(id,oldstat,newstat) {
    //if it didn't go down or something
    if(newstat.code==='green') {
      var target={};
      //[over]write with a new proxy
      function newprox() {
        var newhost=newstat.host,
          newport=newstat.port;
        debug('new prox for node %s, to %s:%s',id,newhost,newport);
        proxies[id]=new httpProxy.createProxyServer({
          target:{
            host:newhost,
            port:newport
          },
          xfwd:true
        });
      }
      //if anything doesn't match up, overwrite
      if(proxies[id]) {
        target=proxies[id].options.target
        if(newstat.host!==target.host||newstat.host!==target.port) {
          newprox();
        }
      } else newprox();
    } else {//if it went down or whatever
      debug('code %s: prox for node %s is down',newstat.code,id);
      delete proxies[id];
    }
  }
  function wsroute(req,res,method,head) {
    //capture url groups
    var capture=/^\/node\/([0-9]+)\/(.*)/.exec(req.url);
    var id=capture[1],qs=capture[2];
    //route to socket server
    if(proxies[id]) {
      req.url='/socket.io/'+qs;
      proxies[id][head?'ws':'web'](req,res,head);
    } else {
      //route doesn't exist, yell what error color
      res.writeHead(502,{'Content-Type':'text/plain'});
      var info=status[id]||['red'];
      res.end(info[0]);
    }
  }
  //right now only cares about frontproxy, may change
  var server = https.createServer(config.proxy.https(),function(req,res) {
    if(/^\/node\/[0-9]+\//.test(req.url)) {
      wsroute(req,res);
    } else {
      frontproxy.web(req,res);
    }
  });
  server.on('upgrade',wsroute);
  redirect.listen(port);
  server.listen(ports);
  debug('listening at %s and %s.',port,ports);
};
