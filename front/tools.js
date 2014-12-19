var
  config=require('../config.js');

module.exports=function(debug,app,express) {
  debug('tools initializing');
  var static=config.static(app,express);
  static('/tools','tools');
  static('/tools/js','shared');
  static('/tools/js/lib','components');
};
