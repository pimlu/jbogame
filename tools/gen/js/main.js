var game;
require.config({
  paths: {
    jquery: './lib/jquery/dist/jquery.min',
    seedrandom: './lib/seedrandom/seedrandom.min',
    noise: './lib/noisejs/index'
  }
});
require(['jquery', './Planet', './flatscape'], function($, Planet, flat) {
  var iseed = '' + Math.random();
  console.log(iseed);
  $(start.bind(null, $, Planet, flat, iseed));
});
var planet, height;

function start($, Planet, flat, seed) {
  var w = 1024,
    h = 1024,
    scale = 0.5,
    iter = 1000;
  planet = new Planet(w, h, seed, iter);
  map = planet.height(0, 0, w, h, scale);
  flat('flat', map, w, h, scale);
}