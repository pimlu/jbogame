var bcrypt = require('bcrypt');
var tot = 0;
var iter = 100;
for (var i = 0; i < iter; i++) {
  var randstr = '' + Math.random();
  var time = Date.now();
  bcrypt.hashSync(randstr, 8);
  var d = Date.now() - time;
  console.log(i, d);
  tot += d;
}
console.log('avg %s ms', tot / iter);