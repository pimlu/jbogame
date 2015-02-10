var config = require('../config.js'),
  Promise = require('bluebird'),
  redis = require('then-redis'),
  THREE = require('three');

var inspect = require('util').inspect;


var sysid,
  sysname,
  step = config.server.cl.step;

var timer = require('./looptimer.js'),
  phys = require('../shared/phys.js')(THREE, step),
  Character = require('./Character.js'),
  User = require('./User.js'),
  Entity = require('./Entity.js');

var debug, knex, rdcl, feed;

module.exports = function(debug_, knex_, rdcl_, sysname_, feed_) {
  debug = debug_;
  knex = knex_;
  rdcl = rdcl_;
  sysname = sysname_;
  feed = feed_;

  return knex('systems').select('id').where('name', sysname).then(function(row) {
    sysid = row[0].id;
    var req = {
      debug: debug,
      knex: knex,
      name: sysname,
      id: sysid
    };
    Character.req = User.req = Entity.req = req;
    return Entity.loadall();
  }).then(function() {
    //debug(inspect(Entity.ents));
    //debug(Object.keys(Entity.ents));
    timer(debug, feed, loop);
    return connect;
  });
};

//sync up time
function connect(user, ws) {
  var i = 0;
  var t = setTimeout(function() {
    ws.close('ur 2 slow');
  }, 5000);
  ws.onmessage(function(msg) {
    if (i++ >= 100) {
      ws.close('too many time reqs');
    } else if (msg === 'synced') {
      clearTimeout(t);
      setup(user, ws);
    } else {
      ws.rel({
        t: +new Date
      });
    }
  });
}

//client says we've finished timesync, get rolling
function setup(user, ws) {
  ws.onmessage(function() {}); //TODO client input handling
  //ws.onclose(function(e) {
  //  close(user, e.code, e.reason);
  //});
  debug.dbg('user', inspect(user));
  User.connect(user, ws);
  //userman.connect(user, ws);

  setTimeout(function() {
    ws.close(4001, 'idle');
  }, 60000);
}

function close(user, code, reason) {
  debug.dbg('close %s %s %s', user.id, code, reason);
  userman.close(user, code, reason);
}

//actual game logic in here
function loop(tick, dilation) {
  Entity.dotick(tick, dilation);
  User.updatestate(tick, dilation);
}
