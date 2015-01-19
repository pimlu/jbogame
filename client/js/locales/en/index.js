
define(['./core','./login'],function(core,login) {
  var en={
    core:core,
    login:login,
    titletest:'test title',
    alerttest:'alert test',
    attrtest:function(l,o) {
      return 'using language '+l('langname')+'. number is '+o('number')+'.';
    }
  };
  return en;
});
