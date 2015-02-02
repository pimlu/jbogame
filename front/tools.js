var
  config = require('../config.js');

module.exports = function(debug, app, express) {
  //debug('tools initializing');
  var static = config.static(app, express);
  static('/tools', 'tools');

  function jsroute(url) {
    static('/tools/' + url + '/js', 'shared');
    static('/tools/' + url + '/js/lib', 'components');
  }
  jsroute('gen');
  jsroute('sculpt');
};