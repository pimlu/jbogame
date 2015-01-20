(function() {

  if(typeof define==='function') {
    define([],impl);
  } else if(typeof module==='object') {
    module.exports=impl();
  }
  function impl() {
    return function(pstep_) {
      pstep=pstep_/1000;
      return {
        pmove:pmove,
        fstep:null,
        fmove:null
        };
      }
  }

  var pdrag=0.9;//per second
  var pstep;//s per player step
  pdrag=Math.pow(pdrag,pstep);


  //we can just use implicit euler for this one
  function pmove(p,v,a) {
    a.multiplyScalar(pstep);
    v.add(a);
    v.multiplyScalar(pdrag);
    var dp=new THREE.Vector2(0,0).copy(v).multiplyScalar(pstep);
    p.add(dp);
  }
})();
