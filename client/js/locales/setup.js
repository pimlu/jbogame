define(function() {
  return function setup(obj) {
    for (var i in obj) {
      //transform strings into functions that return them
      if (typeof obj[i] === 'string') {
        (function(str) {
          obj[i] = function() {
            return str;
          }
        })(obj[i]);
      } else if (typeof obj[i] === 'object') {
        setup(obj[i]);
      }
    }
    return obj;
  };
});