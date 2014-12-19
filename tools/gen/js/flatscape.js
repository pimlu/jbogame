define(['jquery'],function($) {
    return function(id,map,w,h,scale) {
      var c=$('#'+id)[0];
      console.log(c);
      c.width=w*scale;
      c.height=h*scale;
      var ctx=c.getContext('2d');
      var img=ctx.getImageData(0,0,w*scale,h*scale);
      var data=img.data;
      var max=-Infinity;
      for(var pos=0;pos<map.length;pos++) {
        if(map[pos]>max) max=map[pos];
      }
      console.log(max);
      for(var pos=0;pos<map.length;pos++) {
        var i=pos*4;
        data[i+3]=255;
        if(map[pos]>0) {
          data[i]=data[i+1]=data[i+2]=map[pos]/max*255|0;
        } else {
          data[i]=0;
          data[i+1]=0;
          data[i+2]=255;
        }
      }
      ctx.putImageData(img,0,0);
    };
});
