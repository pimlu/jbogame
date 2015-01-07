var _=require('lodash');
//assigns systems based on LPT scheduling
module.exports=function(debug,cores,data) {
  debug('allocator balacing.');
  var plan=new Array(cores),load=[];
  //filter out everything but name and load, from greatest to least
  var systems=Object.keys(data.systems).map(function(k) {
    return {name:k,load:data.systems[k].loadavg};
  }).sort(function(a,b) {
    return b.load-a.load;
  });
  for(var i=0;i<cores.length;i++) {
    plan[i]=[];
    load[i]=0;
  }
  //TODO: reduce this to nlogm time;  currently n*m
  //adds systems in descending load order to the current least-loaded machine
  for(var i=0;i<systems.length;i++) {
    var min=Infinity,minj;
    for(var j=0;j<cores.length;j++) {
      if(load[j]<min) {
        min=load[j];
        minj=j;
      }
    }
    plan[minj].push(systems[i].name);
    load[minj]+=systems[i].load/cores[minj];
  }
  return plan;
}
