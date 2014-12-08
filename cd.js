var
  config=require('./config.js'),
  _=require('lodash'),
  path=require('path'),
  http=require('http'),
  express=require('express'),
  bodyparser=require('body-parser'),
  app = express();

var dnjoin=path.join.bind(path,__dirname);

module.exports=function() {
  app.use(express.static(dnjoin(config.cd.dir)));
  app.use('/js/lib',express.static(dnjoin('components')));

  http.createServer(app).listen(config.cd.port);
  console.log('content delivery listening at %s',config.cd.port);
};
