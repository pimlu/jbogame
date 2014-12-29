//load up redis
var config=require('../config.js');
//fluff up the delay with a bit of randomness
//this way the statuses aren't all in sync over and over
function fluff(t,x) {
  return t*(1-x/2+x*Math.random());
}

var nop=function(){};

module.exports=function(debug,world,type,port,redis,rdcl) {
  redis=redis||require('redis'),
  rdcl=rdcl||redis.createClient(config.redis);
  var statustime=config.server.statustime,
    status='green';
  //wnum,status,host,port
  var msg=[world,status,config.server.host,port];
  function report() {
    msg[1]=status;
    rdcl.publish('world.status',msg.join(','));
  }
  //report back status periodically
  setInterval(report,fluff(statustime,0.3));

  //if the watchdog isn't fed, then warn
  //it has around ~statustime ms of headroom
  var timeout;
  function reset() {
    status='green';
    clearTimeout(timeout);
    timeout=setTimeout(function() {
      status='yellow';
      report();//report asap
      debug.warn('watchdog not fed! %s',JSON.stringify(msg));
    },config.server.wdtime);
  }
  reset();
  report();
  return reset;
};
