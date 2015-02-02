define(['log'], function(log) {
  var samples = 10;
  //sample everything below the first std devation
  var maxsamp = Math.round(0.8413 * samples);

  function TimeSync(all, setup) {
    this.all = all;
    this.setup = setup;
    this.ws = null;
    this.sdiffs = [];
    this.lats = [];
    this.last = 0;
    this.i = 0;
  }
  TimeSync.prototype.connect = function() {
    this.ws = this.all.state.ws;
    this.last = +new Date;
    //poke the server for a time (start the loop)
    this.ws.rel('');
  };
  TimeSync.prototype.message = function(msg) {
    var self = this;

    if (this.i < samples) {
      var now = +new Date;
      var dt = now - this.last;

      this.sdiffs.push(msg.t - now + dt / 2);
      this.lats.push(dt);

      //wait a bit for more accuracy
      setTimeout(function() {
        self.last = +new Date;
        self.ws.rel('');
      }, 50);

      this.i++;
    } else {
      this.ws.rel('synced');
      log.debug('synced');

      //sort them by latency
      var stats = this.lats.map(function(v, i) {
        return {
          lat: v,
          sdiff: self.sdiffs[i]
        }
      }).sort(function(a, b) {
        return a.lat - b.lat;
      });

      //average the ones below the first std dev
      var avglat = 0,
        avgdiff = 0;
      for (var i = 0; i < maxsamp; i++) {
        avglat += stats[i].lat;
        avgdiff += stats[i].sdiff;
      }
      avglat /= maxsamp;
      avgdiff /= maxsamp;

      log.debug(avglat, avgdiff);
      this.setup(avglat, avgdiff);
    }
  };
  return TimeSync;
});