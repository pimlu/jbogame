(function() {
  var modules=['core','login','tut','chat'];
  var langs=['en','jbo'];
  var paths=['./setup'];


  //auto generate what to require
  for(var i=0;i<langs.length;i++) {
    for(var j=0;j<modules.length;j++) {
      paths.push('./'+langs[i]+'/'+modules[j]);
    }
  }

  define(paths,function(setup) {
    var locales={};
    var argi=1;
    //populate locales based on module system
    for(var i=0;i<langs.length;i++) {
      var curloc=locales[langs[i]]={};
      for(var j=0;j<modules.length;j++) {
        curloc[modules[j]]=arguments[argi++];
      }
      setup(curloc);
    }
    return locales;
  });
})();
