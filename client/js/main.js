var game;
require.config({
  paths:{
    lodash:'./lib/lodash/dist/lodash.min',
    pubsub:'./lib/pubsub-js/src/pubsub',
    bson:'./lib/bson/browser_build/bson',
    log:'./lib/loglevel/dist/loglevel.min'
  },
  shim:{
    bson:{exports:'bson'}
  }
});
require(['Game','localizer'],function(Game,l) {
  $(function() {
    game=new Game();
  });
});
