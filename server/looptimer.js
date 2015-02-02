var
  config = require('../config.js');

module.exports = function(debug, feed, loop) {

  var tlast = +new Date,
    slast = 0,
    dilsmooth = config.server.cl.dilsmooth,
    dilation = 1,
    step = config.server.cl.step,
    tick = 0;

  if (debug.test(3)) {
    setInterval(function() {
      debug.dbg('dilation is %s', dilation);
    }, 10000);
  }

  //feeds watchdog, maintains time, and such
  function timeloop(arg) {
    feed();
    /*tdiff- how long it's been since last loop.  goal is 50
    step- 50
    slast- how long we had to sleep last time, say 40
    50+40-50=40
    if last step took longer than usual,
    50+40-60=30
    time dilation is tdiff/step
    */
    var tnow = +new Date,
      tdiff = tnow - tlast,
      tsleep = Math.max(0, step + slast - tdiff);
    slast = tsleep;
    dilation = dilsmooth * tdiff / step + (1 - dilsmooth) * dilation;

    loop(tick, dilation);
    tick++;

    tlast = tnow;
    setTimeout(timeloop, tsleep);
  }

  timeloop();
};