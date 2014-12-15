function World() {
  this.scene = new THREE.Scene();
  this.entities=new LinkedList();
  this.cament=null;
}
World.prototype.getscene=function() {
  return this.scene;
};
World.prototype.getcamera=function() {
  return this.cament?this.cament.getcamera():null;
};
