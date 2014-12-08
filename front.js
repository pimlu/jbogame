var
  config=require('./config.js'),
  _=require('lodash'),
  path=require('path'),
  http=require('http'),
  https=require('https'),
  express=require('express'),
  bodyparser=require('body-parser'),
  bcrypt=require('bcrypt'),
  app = express();

function forcehttps(req,res,next) {
  if(req.secure) {
    return next();
  }
  res.redirect('https://'+req.hostname
  +(config.front.ports===443?'':':'+config.front.ports)
  +req.url);
}
var dnjoin=path.join.bind(path,__dirname);

module.exports=function(knex) {
  var brute=config.brute();
  //runs after tables have been checked
  console.log('setting up express...');

  app.all('*', forcehttps);
  //so we can post things and such
  app.use(bodyparser.urlencoded({extended:true}));
  app.use(bodyparser.json());
  //set up routes
  app.use(express.static(dnjoin('public')));
  app.use(express.static(dnjoin('shared')));
  app.use('/js/lib',express.static(dnjoin('components')));
  app.post('/register',require('./register.js')(knex));
  app.post('/changepass',brute.prevent,require('./changepass.js')(knex));
  //listen on both ports
  http.createServer(app).listen(config.front.port);
  https.createServer(config.front.https(),app).listen(config.front.ports);
  console.log('front listening at %s and %s.',config.front.port,config.front.ports);
};
