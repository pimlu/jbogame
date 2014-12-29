var
  config=require('./config.js'),
  redis=require('redis');

//runs immediately because I want to be able to `node rev.js`
var pub=redis.createClient(config.redis);
pub.set('nodeid',0);
pub.publish('node.rev','gotta go fast');
pub.quit();
