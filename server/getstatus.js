//load up redis
var config=require('../config.js'),
  _=require('lodash'),
  redis=require('then-redis'),
  rdcl=config.rdcl(redis);

var status=[];
var timeouts=[];
var nop=function(){};

rdcl.subscribe('node.status');

rdcl.on('message',function(channel,message) {
  message=JSON.parse(message);
  //happens when a status updates
  function statmsg(id,data) {
    if(!_.isEqual(data,status[id])) {
      exports.change(id,status[id],data);
      status[id]=data;
    }
  }

  switch(channel) {
    //nothing else yet
    case 'node.status':
      var id=message.id;
      delete message.id;
      statmsg(id,message);

      clearTimeout(timeouts[id]);
      timeouts[id]=setTimeout(function() {
        var newmsg=_.cloneDeep(message);
        newmsg.code='red';
        statmsg(node,newmsg);
      },config.server.statustime*2);
      break;
  }
});

exports.status=status;
exports.change=nop;
exports.redis=redis;
exports.rdcl=rdcl;
