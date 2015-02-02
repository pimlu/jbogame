(function() {

  if (typeof define === 'function') {
    define(function() {
      return impl;
    });
  } else if (typeof module === 'object') {
    module.exports = impl;
  }
  var THREE;

  function impl(THREE_, pstep_) {
    THREE = THREE_;
    pstep = pstep_ / 1000;
    return {
      pmove: pmove,
      fstep: null,
      fmove: null
    };
  }

  var pdrag = 0.9; //per second
  var pstep; //s per player step
  pdrag = Math.pow(pdrag, pstep);


  //we can just use implicit euler for this one
  function pmove(p, v, a) {
    a.multiplyScalar(pstep);
    v.add(a);
    v.multiplyScalar(pdrag);
    var dp = new THREE.Vector2(0, 0).copy(v).multiplyScalar(pstep);
    p.add(dp);
  }
})();