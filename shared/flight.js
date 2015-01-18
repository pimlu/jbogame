(function() {

  if(typeof define==='function') {
    define([],impl);
  } else if(typeof module==='object') {
    module.exports=impl();
  }
  function impl() {
    return {
      pstep:pstep,
      pmove:pmove,
      fstep:null,
      fmove:null
      };
  }

  var pdrag=0.9;//per second
  var pstep=50/1000;//ms per player step
  pdrag=Math.pow(pdrag,pstep);


  //we can just use implicit euler for this one
  function pmove(o,ax,ay) {
    var dt=pstep;
    o.vx+=ax*dt;
    o.vx*=pdrag;
    o.vy+=ay*dt;
    o.vy*=pdrag;
    o.x+=o.vx*dt;
    o.y+=o.vy*dt;
  }
})();
