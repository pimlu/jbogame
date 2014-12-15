//load up redis
var config=require('../config.js'),
  redis=require('redis'),
  rdcl=redis.createClient(config.redis);

var status=[];
var timeouts=[];
var nop=function(){};

function arreq(a,b) {
  if(a===b) return true;
  if(a==null||b==null) return false;
  if(a.length!=b.length) return false;
  for(var i=0;i<a.length;++i) {
    if(a[i]!==b[i]) return false;
  }
  return true;
}

rdcl.subscribe('world.status');

rdcl.on('message',function(channel,message) {

  function statmsg(world,data) {
    if(!arreq(data,status[world])) {
      exports.change(world,status[world],data);
      status[world]=data;
    }
  }

  switch(channel) {
    //nothing else yet
    case 'world.status':
      var data=message.split(','),
        world=data[0];
      data=data.splice(1);
      statmsg(world,data);

      clearTimeout(timeouts[world]);
      timeouts[world]=setTimeout(function() {
        var newstat=data.splice(0);
        newstat[0]='red';
        statmsg(world,newstat);
      },config.server.statustime*2);
      break;
  }
});

exports.status=status;
exports.change=nop;
exports.redis=redis;
exports.rdcl=rdcl;
