(function() {
  var modules=['core','chat','login'];
  var paths=['./setup'];

  //auto generate what to require
  for(var i=0;i<modules.length;i++) {
    paths.push('./dialogs/'+modules[i]);
  }

  define(paths,function(setup) {
    var locales={};
    //populate dialogs based on module system
    var dialogs={};
    for(var i=0;i<modules.length;i++) {
      dialogs[modules[i]]=arguments[i+1];
    }
    setup(dialogs);
    return dialogs;
  });
})();
