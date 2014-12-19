(function() {
  //silly differentiation based on what module system we're using
  if(typeof define==='function') {
    define(['seedrandom','noise'],impl);
  } else if(typeof module==='object') {
    module.exports=impl(require('seedrandom'),require('noisejs'));
  }
  //our actual implementation
  function impl(seedrandom,Noise) {
    function Planet(w,h,seed,iter) {
      this.w=w;this.h=h;
      var rand=seedrandom(''+seed);
      this.idetail=300;
      this.sdetail=2;
      this.smag=2.5;
      this.levels=[];
      for(var i=0;i<6;i++) {
        this.levels.push(new Noise(rand()));
      }
      this.initial=-120;
    }

    Planet.prototype.height=function(ix,iy,w,h,scale) {
      var height=new Float64Array(w*h*scale*scale);
      for(var i=0;i<height.length;i++) {
        height[i]=this.initial;
      }

      function applysimplex(noise,detail,mag) {
        var index=0,
          downsize=1/detail/scale;
        for(var y=0;y<h*scale;y++) {
          for(var x=0;x<w*scale;x++) {
            var xpos=(ix+x)*downsize,
              ypos=(iy+y)*downsize;
            height[index]+=noise.simplex2(xpos,ypos)*mag;
            index++;
          }
        }
      }
      var detail=this.idetail;
      var mag=this.idetail;
      for(var i=0;i<this.levels.length;i++) {
        applysimplex(this.levels[i],detail,mag);
        detail/=this.sdetail;
        mag/=this.smag;
      }
      return height;
    }

    return Planet;
  }
})();
