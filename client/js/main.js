var game;
require.config({
  paths:{
    jquery:'./lib/jquery/dist/jquery.min',
    'jquery-ui':'./lib/jquery-ui/ui',
    three:'./lib/threejs/build/three.min',
    socketio:'./lib/socket.io'
  },
  shim:{
    three:{exports:'THREE'}
  }
});
require(['./Game'],function(Game) {
  $(function() {
    game=new Game();
  });
});
