var
  config=require('../config.js'),
  path=require('path');


module.exports=function(debug,app,express) {
  debug('cd initializing');
  var static=config.static(app,express);
  //component libraries
  static('/kelci',config.front.cd.dir);
  static('/kelci/js/lib','components');
  static('/kelci/js','shared');
  //TODO require.js optimization
};
