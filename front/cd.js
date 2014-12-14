var
  config=require('../config.js'),
  path=require('path');

var dnjoin=path.join.bind(path,__dirname);

module.exports=function(app,express,debug) {
  debug('cd initializing');
  //component libraries
  app.use('/kelci/js/lib',express.static(dnjoin('../components')));
  //TODO actual content delivery
  //TODO require.js optimization
};
