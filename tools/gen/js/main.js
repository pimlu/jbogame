var game;
require.config({
  paths:{
    jquery:'./lib/jquery/dist/jquery.min',
    three:'./lib/threejs/build/three.min',
    socketio:'./lib/socket.io'
  },
  shim:{
    three:{exports:'THREE'}
  }
});
require(['./terraingen'],function(tg) {
  $(function() {
  });
});
