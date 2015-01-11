var game;
require.config({
  paths:{
    lodash:'./lib/lodash/dist/lodash.min',
    'es5-shim':'./lib/es5-shim/es5-shim.min',
    'es6-shim':'./lib/es6-shim/es6-shim.min',
    pubsub:'./lib/pubsub-js/src/pubsub',
    jquery:'./lib/jquery/dist/jquery.min',
    'jquery-ui':'./lib/jquery-ui/ui',
    three:'./lib/threejs/build/three.min',
    bson:'./lib/bson/browser_build/bson',
    reified:'./lib/reified-browser'
  },
  shim:{
    three:{exports:'THREE'},
    bson:{exports:'bson'},
    reified:{exports:'reified'}
  }
});
require(['Game','localizer'],function(Game,l) {
  $(function() {
    game=new Game();
  });
});
