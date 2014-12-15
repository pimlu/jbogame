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
  getstatus.change=function(wnum,oldstat,newstat) {
    //if it didn't go down or something
    if(newstat[0]==='green') {
      var target={};
      //[over]write with a new proxy
      function newprox() {
        var newhost=newstat[3],
          newport=+newstat[4];
        debug('new prox for world %s, to %s:%s',wnum,newhost,newport);
        proxies[wnum]=new httpProxy.createProxyServer({
          target:{
            host:newhost,
            port:newport
          },
          xfwd:true
        });
      }
      //if anything doesn't match up, overwrite
      if(proxies[wnum]) {
        target=proxies[wnum].options.target
        if(!newstat[3]===target.host||!newstat[4]===target.port) {
          newprox();
        }
      } else newprox();
    } else {//if it went down or whatever
      debug('code %s: prox for world %s is down',newstat[0],wnum);
      delete proxies[wnum];
    }
  }

  //right now only cares about frontproxy, may change
  var server = https.createServer(config.proxy.https(),function(req,res) {
    if(/^\/world\/[0-9]+\//.test(req.url)) {
      var capture=/^\/world\/([0-9]+)\/(.*)/.exec(req.url);
      var wnum=capture[1],qs=capture[2];
      req.url='/socket.io/'+qs;
      proxies[wnum].web(req,res);
    } else {
      frontproxy.web(req,res);
    }
  });
  server.on('upgrade',function(req,socket,head) {
    //TODO websocket code
    debug('upgrade attempt');
  });
  redirect.listen(port);
  server.listen(ports);
  debug('listening at %s and %s.',port,ports);
};
