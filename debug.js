var colors=require('colors/safe'),
  zdb=process.env.ZDEBUG||'-*',
  rules=zdb.split(',');

//0=don't change,1=true,-1=false
function checkname(name) {
  var log=true;
  function checkrule(rule,name) {
    if(rule[0]==='-') return -checkrule(rule.substr(1),name);
    if(rule==='*'||rule===name) return 1;
    return 0;
  }
  for(var i in rules) {
    var match=checkrule(rules[i],name);
    if(match!==0) log=match>0;
  }
  return log;
}
module.exports=function(color,name,id) {
  //generates logger function with appropriate colored prefix
  function genlog(fn,sep) {
    if(fn!=='error'&&!checkname(name)) return function(){};
    return function(txt) {
      var tail=[].slice.call(arguments,1);
      var who=colors.bold[color](name)+sep;
      console[fn].bind(null,who+txt).apply(console,tail);
    }
  }
  var cycle='red,white,green,yellow,blue,magenta,cyan'.split(',');
  var sep=' '+(typeof id==='undefined'?''
    :colors.bold[cycle[id%cycle.length]](id)+' ');
  //initialize log,warn,err with the right text
  var debug=genlog('log',sep);
  debug.warn=genlog('warn',' '+colors.bold.yellow.inverse('WARN')+sep);
  debug.err=debug.error=genlog('error',' '+colors.bold.red.inverse('ERR')+sep);

  return debug;
};
