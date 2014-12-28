define(['./setup'],function(setup) {
  var en={
    lang:'language',
    langname:'English',
    welcome:'Welcome',
    plsplay:'Welcome to zdelu!  Try as a guest or log in.',
    guest:'guest',
    login:'log in',
    username:'username',
    password:'password',
    titletest:'test title',
    alerttest:'alert test',
    attrtest:function(l,o) {
      return 'using language '+l('langname')+'. number is '+o('number')+'.';
    }
  };
  return setup(en);
});
