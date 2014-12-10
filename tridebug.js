var debug=require('debug');
module.exports=function() {
  var fname=Array.prototype.join.bind(arguments)(':');
  var log=debug(fname),
    warn=debug(fname+':warn'),
    err=debug(fname+':err');
  warn.log=console.warn.bind(console);
  err.log=console.error.bind(console);
  log.warn=warn;
  log.err=log.error=err;
  return log;
};
