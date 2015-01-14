define({
  welcome:'Welcome',
  play:'Welcome to zdelu!  Try as a guest or log in.',
  dirtyclose:function(l,o) {
    return 'Connection to the server has been lost.  Error code: '+o('ecode');
  },
  connectionlost:'Connection lost',
  kicked:function(l,o) {
    return 'You have been kicked.  Reason:'+o('reason');
  },
  guest:'guest',
  login:'log in',
  username:'username',
  password:'password'
});
