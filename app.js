var config=require('./config.js'),
  _=require('lodash'),
  http=require('http'),
  https=require('https'),
  express=require('express'),
  bodyparser=require('body-parser');
  path=require('path'),
  knex=require('knex')(config.knex),
  brute=config.brute,
  bcrypt=require('bcrypt');
var app = express();

function forcehttps(req,res,next) {
  if(req.secure) {
    return next();
  }
  res.redirect('https://'+req.hostname
    +(config.web.ports===443?'':':'+config.web.ports)
    +req.url);
}
var dnjoin=path.join.bind(path,__dirname);

require('./dbcheck.js')(knex).then(function() {
  //runs after tables have been checked
  console.log('setting up express...');

  app.all('*', forcehttps);
  //so we can post things and such
  app.use(bodyparser.urlencoded({extended:true}));
  app.use(bodyparser.json());
  //set up routes
  app.use(express.static(dnjoin('public')));
  app.use(express.static(dnjoin('shared')));
  if(config.debug) {
    console.log('lols');
    app.use('/debug',express.static(dnjoin('debug')));
    app.use('/debug/js/lib',express.static(dnjoin('bower_components')));
  }
  app.use('/js/lib',express.static(dnjoin('bower_components')));
  app.use('/kelci/js/lib',express.static(dnjoin('bower_components')));
  app.post('/register',require('./register.js')(knex));
  app.post('/changepass',brute.prevent,require('./changepass.js')(knex));
  //listen on both ports
  http.createServer(app).listen(config.web.port);
  https.createServer(config.web.https,app).listen(config.web.ports);
  console.log('web listening at %s and %s.',config.web.port,config.web.ports);
});
