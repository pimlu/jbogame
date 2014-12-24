define(function() {
  return function(arr) {
    for(var i in arr) {
      if(typeof arr[i]==='string') {
        (function(str){
          arr[i]=function() {
            return str;
          }
        })(arr[i]);
      }
    }
    return arr;
  };
});
