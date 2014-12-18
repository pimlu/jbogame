var game;
require.config({
  paths:{
    jquery:'./lib/jquery/dist/jquery.min',
    three:'./lib/threejs/build/three.min',
    socketio:'./lib/socket.io'
  },
  shim:{
    three:{exports: 'THREE'}
  }
});
require(['./Game'],function(Game) {
  $(function() {
    console.log('happening');
    game=new Game();
  });
});
