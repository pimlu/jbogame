define(['./core','./login'],function(core,login) {
  var jbo={
    core:core,
    login:login,
    titletest:'cmene cipra',
    alerttest:'notci cipra',
    attrtest:function(l,o) {
      return 'ca\'a pilno la '+l('langname')+' .i se namcu li '+o('number')+'.';
    }
  };
  return jbo;
});
