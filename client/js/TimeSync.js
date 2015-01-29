define(['log'],function(log) {
  function TimeSync(all,setup) {
    this.all=all;
    this.setup=setup;
    this.ws=null;
    this.times=[];
  }
  TimeSync.prototype.connect=function() {
    this.ws=this.all.state.ws;
    this.ws.rel('');
  };
  TimeSync.prototype.message=function(msg) {
    log.debug(msg);
    this.ws.rel('synced');
    this.setup();
  };
  return TimeSync;
});
