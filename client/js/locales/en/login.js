define({
  welcome: 'Welcome',
  play: 'Welcome to zdelu!  Try as a guest or log in.',
  badpass: 'Username does not match password.',
  authfail: 'Failed to connect to server.',
  auth: 'Connecting...',
  connectionlost: 'Connection to server lost.',
  failclose: function(l, o) {
    return 'Failed to connect to ' + o('system') + '.  Error code: ' + o('ecode');
  },
  dirtyclose: function(l, o) {
    return 'Connection to the server has been lost.  Error code: ' + o('ecode');
  },
  kicked: function(l, o) {
    return 'You have been kicked.  Reason: ' + o('reason');
  },
  guest: 'guest',
  login: 'log in',
  username: 'username',
  password: 'password'
});