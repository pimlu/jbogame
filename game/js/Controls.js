function Controls(o) {
  for(i in o) this[i]=o[i];
  this.keys=new Array(128).fill(false);
  document.addEventListener('mousemove',this.mousemove,false);
  document.addEventListener('keydown',this.keydown.bind(this),false);
  document.addEventListener('keyup',this.keyup.bind(this),false);
  this.locked=false;
  this.dx=0;
  this.dy=0;
}
Controls.prototype.keydown=function(e) {
  console.log('pressed '+String.fromCharCode(e.keyCode));
  this.keys[e.keyCode]=true;
};
Controls.prototype.keyup=function(e) {
  this.keys[e.keyCode]=false;
};
Controls.prototype.mousemove=function(e) {
  if(!this.locked) return;
  this.dx+=e.movementX;
  this.dy+=e.movementY;
};
Controls.prototype.dmouse=function() {
  var delta={x:this.dx,y:this.dy};
  this.dx=this.dy=0;
  return delta;
};
