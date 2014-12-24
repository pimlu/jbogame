define(['./setup'],function(setup) {
  var en={
    lang:'language',
    langname:'English',
    login:'pls login',
    titletest:'test title',
    alerttest:'alert test',
    attrtest:function(l,o) {
      return 'using language '+l('langname')+'. number is '+o('number')+'.';
    }
  };
  return setup(en);
});
