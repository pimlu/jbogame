//load up redis
var config=require('../config.js'),
  redis=require('then-redis');
//fluff up the delay with a bit of randomness
//this way the statuses aren't all in sync over and over
function fluff(t,x) {
  return t*(1-x/2+x*Math.random());
}

var nop=function(){};

module.exports=function(debug,id,port,rdcl) {
  rdcl=rdcl||config.rdcl(redis);
  var statustime=config.server.statustime;
  var msg={
    id:id.replace(/ /g,'_'),
    code:'green',
    host:config.server.host,
    port:port
  };
  function report() {
    rdcl.publish('node.status',JSON.stringify(msg));
  }
  //report back status periodically
  setInterval(report,fluff(statustime,0.3));

  //if the watchdog isn't fed, then warn
  //it has around ~statustime ms of headroom
  var timeout;
  function reset() {
    msg.code='green';
    clearTimeout(timeout);
    timeout=setTimeout(function() {
      msg.code='yellow';
      report();//report asap
      debug.warn('watchdog not fed! %s',JSON.stringify(msg));
    },config.server.wdtime);
  }
  reset();
  setTimeout(report,1000);
  return reset;
};
