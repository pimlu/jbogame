var
  config=require('../config.js'),
  path=require('path');

var dnjoin=path.join.bind(path,__dirname);

module.exports=function(debug,app,express) {
  debug('cd initializing');
  //component libraries
  app.use('/kelci',express.static(dnjoin('../'+config.front.cd.dir)));
  app.use('/kelci/js/lib',express.static(dnjoin('../components')));
  //TODO require.js optimization
};
