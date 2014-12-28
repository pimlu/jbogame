define(['./setup'],function(setup) {
  var jbo={
    lang:'bangu',
    langname:'lojban',
    welcome:'fi\'i',
    plsplay:'.ui zanvi\'e fi la zdelu .i ko vitke gi\'onai cmisau',
    guest:'vitke',
    login:'cmisau',
    username:'cmene',
    password:'japyvla',
    titletest:'cmene cipra',
    alerttest:'notci cipra',
    attrtest:function(l,o) {
      return 'ca\'a pilno la '+l('langname')+' .i se namcu li '+o('number')+'.';
    }
  };
  return setup(jbo);
});
