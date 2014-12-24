define(['./setup'],function(setup) {
  var jbo={
    lang:'bangu',
    langname:'lojban',
    login:'ko cmisau',
    titletest:'cmene cipra',
    alerttest:'notci cipra',
    attrtest:function(l,o) {
      return 'ca\'a pilno la '+l('langname')+' .i se namcu li '+o('number')+'.';
    }
  };
  return setup(jbo);
});
