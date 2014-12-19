var game;
require.config({
  paths:{
    jquery:'./lib/jquery/dist/jquery.min',
    three:'./lib/threejs/build/three.min',
    stats:'./lib/stats.js/build/stats.min',
    datgui:'./lib/dat-gui/build/dat.gui.min',
    socketio:'./lib/socket.io',
    seedrandom:'./lib/seedrandom/seedrandom.min',
    noise:'./lib/noisejs/index'
  },
  shim:{
    three:{exports:'THREE'}
  }
});
require(['jquery','scuplt'],function($,sculpt) {
  $(start.bind(null,$,sculpt));
});
var planet,height;
function start($,sculpt) {
  var w=1024,h=1024;
  sculpt('sculpt',null);
}
