var
  config = require('../config.js'),
  redis = require('then-redis'),
  rdcl = config.rdcl(redis),
  _ = require('lodash'),
  path = require('path'),
  http = require('http'),
  express = require('express'),
  bodyparser = require('body-parser'),
  bcrypt = require('bcrypt'),
  app = express();

//TODO consider automating this line
var jadefiles = ['index', 'plibiho', 'japlerpoi'];

module.exports = function(debug, knex) {
  //runs after tables have been checked
  debug('setting up express...');
  var static = config.static(app, express);
  var brute = config.brute();
  app.enable('trust proxy'); //for http-proxy
  app.set('views', config.dnjoin('front/jade'));
  app.set('view engine', 'jade');
  //so we can post things and such
  app.use(bodyparser.urlencoded({
    extended: true
  }));
  app.use(bodyparser.json());
  //set up routes
  jadefiles.forEach(function(name) {
    var path = '/' + (name === 'index' ? '' : name);
    app.get(path, function(req, res) {
      res.render(name);
    });
  });
  static('/', 'front/public');
  static('/js', 'front/shared');
  static('/js/lib', 'components');
  if (config.front.tools) require('./tools.js')(debug, app, express);
  //set up content delivery for the game
  require('./cd.js')(debug, app, express);
  var brutemw = brute.getMiddleware({
    key: function(req, res, next) {
      //prevent too many attempts for the same username
      next(req.body.name);
    }
  });
  //POST forms
  require('./register.js')(knex).then(function(register) {
    app.post('/register', register);
    app.post('/changepass', brutemw, require('./changepass.js')(knex));
    app.post('/auth', brutemw, require('./auth.js')(knex, rdcl));
  });

  http.createServer(app).listen(config.front.port);
  debug('listening at %s.', config.front.port);
};