var colors = require('colors/safe'),
  zdb = process.env.ZDEBUG || '-*',
  //0=errors,1=warn,2=log,3=dbg
  zlvl = +(process.env.ZLVL || 2),
  rules = zdb.split(',');


//0=don't change,1=true,-1=false
function checkname(name) {
  var log = true;

  function checkrule(rule, name) {
    if (rule[0] === '-') return -checkrule(rule.substr(1), name);
    var regex = new RegExp('^' + rule.replace(/\*/g, '.*'));
    if (regex.test(name)) return 1;
    return 0;
  }
  for (var i in rules) {
    var match = checkrule(rules[i], name);
    if (match !== 0) log = match > 0;
  }
  return log;
}
module.exports = function(color, name, id) {
  function nop() {};
  var fullname = name + (id !== void 0 ? '.' + id : '');
  fullname = fullname.replace(/ /g, '_');

  var namelog = checkname(fullname);

  //if checkname says no, don't log, or if lvl>zlvl, don't log
  function test(lvl) {
    return namelog && lvl <= zlvl;
  };
  //generates logger function with appropriate colored prefix
  function genlog(fn, lvl, sep) {
    if (!test(lvl)) return nop;
    return function(txt) {
      /*"Optimization Killers" suggests the below commented line triggers
      fallback to the generic compiler.  we don't want that, especially in
      something as hot as our log function.
      //var tail=[].slice.call(arguments,1);
      */
      var tail = new Array(arguments.length - 1);
      for (var i = 0; i < tail.length; ++i) {
        tail[i] = arguments[i + 1];
      }
      var who = colors.bold[color](name) + sep;
      console[fn].bind(null, who + txt).apply(console, tail);
    }
  }
  var cycle = 'red,white,green,yellow,blue,magenta,cyan'.split(',');
  //cycle through colors based on id
  var sep = ' ' + (typeof id === 'undefined' ? '' : colors.bold[cycle[
    typeof id === 'string' ? 2 : id % cycle.length //if it's a string, just pick green
  ]](id) + ' ');
  //initialize dbg,log,warn,err with the right text
  var debug = genlog('log', 2, sep);
  debug.log = genlog('log', 2, sep); //eh why not
  debug.dbg = genlog('log', 3, ' ' + colors.bold.blue.inverse('DBG') + sep);
  debug.warn = genlog('warn', 1, ' ' + colors.bold.yellow.inverse('WARN') + sep);
  debug.err = debug.error = genlog('error', 0, ' ' + colors.bold.red.inverse('ERR') + sep);
  debug.test = test;

  return debug;
};