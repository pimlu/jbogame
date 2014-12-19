var
  config=require('../config.js'),
  _=require('lodash'),
  path=require('path'),
  http=require('http'),
  express=require('express'),
  bodyparser=require('body-parser'),
  bcrypt=require('bcrypt'),
  app = express();

module.exports=function(debug,knex) {
  //runs after tables have been checked
  debug('setting up express...');
  var static=config.static(app,express);
  var brute=config.brute();
  app.enable('trust proxy');//for http-proxy
  //so we can post things and such
  app.use(bodyparser.urlencoded({extended:true}));
  app.use(bodyparser.json());
  //set up routes
  static('/','front/public');
  static('/js','front/shared');
  static('/js/lib','components');
  if(config.front.tools) require('./tools.js')(debug,app,express);
  //set up content delivery for the game
  require('./cd.js')(debug,app,express);
  //POST forms
  app.post('/register',require('./register.js')(knex));
  app.post('/changepass',brute.prevent,require('./changepass.js')(knex));
  //listen on both ports
  http.createServer(app).listen(config.front.port);
  debug('listening at %s.',config.front.port);
};
