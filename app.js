var config=require('./config.js'),
  express=require('express'),
  path=require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'shared')));
app.use('/js/lib',express.static(path.join(__dirname,'public/kelci/js/lib')));

var listener = app.listen(config.web.port);
console.log('web listening at %s', listener.address().port);
