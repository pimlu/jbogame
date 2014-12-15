var
  config=require('../config.js'),
  _=require('lodash'),
  path=require('path'),
  http=require('http'),
  express=require('express'),
  bodyparser=require('body-parser'),
  bcrypt=require('bcrypt'),
  app = express();

var dnjoin=path.join.bind(path,__dirname);

module.exports=function(debug,knex) {
  var brute=config.brute();
  //runs after tables have been checked
  debug('setting up express...');
  app.enable('trust proxy');//for http-proxy
  //so we can post things and such
  app.use(bodyparser.urlencoded({extended:true}));
  app.use(bodyparser.json());
  //set up routes
  app.use(express.static(dnjoin('public')));
  app.use(express.static(dnjoin('shared')));
  app.use('/js/lib',express.static(dnjoin('../components')));
  //set up content delivery for the game
  require('./cd.js')(app,express,debug);
  //POST forms
  app.post('/register',require('./register.js')(knex));
  app.post('/changepass',brute.prevent,require('./changepass.js')(knex));
  //listen on both ports
  http.createServer(app).listen(config.front.port);
  debug('listening at %s.',config.front.port);
};
