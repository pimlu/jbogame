(function() {

  if(typeof define==='function') {
    define([],impl);
  } else if(typeof module==='object') {
    module.exports=impl();
  }

  function impl() {
    return verlet;
  }

  function verlet(x,lx,a,dt) {
    return 2*x-lx+a*dt*dt;
  }
})();
