
module.exports=function(debug,nodes,data) {
  var plan=[];
  plan.length=1;//first spot is undefined
  for(var i=1;i<=nodes;i++) {
    plan.push([i]);
  }
  return plan;
}
