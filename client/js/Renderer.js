define(['utils'],function(utils) {
  Element.prototype.requestPointerLock = Element.prototype.requestPointerLock || Element.prototype.mozRequestPointerLock || Element.prototype.webkitRequestPointerLock;
  function Renderer(o) {
    for(var i in o) this[i]=o[i];

    var r = this.r= new THREE.WebGLRenderer();

    this.camera = new THREE.PerspectiveCamera(70,1,1,1000 );

    this.elem=document.body;
    $('html').addClass('full');
    this.winresize();
    window.addEventListener( 'resize', this.winresize.bind(this) , false );

    $(r.domElement).addClass('game');
    this.elem.appendChild( r.domElement );

    this.camera.position.y = 400;
    this.camera.position.z = 200;

    this.scene = new THREE.Scene();

    var geo = new THREE.BoxGeometry( 200, 200, 200 );

    var tex = THREE.ImageUtils.loadTexture( 'tex/crate.gif' );
    tex.anisotropy = r.getMaxAnisotropy();

    var mat = new THREE.MeshBasicMaterial( { map: tex } );
    this.mesh = new THREE.Mesh( geo, mat );
    this.scene.add( this.mesh );
    this.mesh.position.z=200;
    this.camera.lookAt(this.mesh.position);
    this.camera.rotation.z=Math.PI;

    geo=new THREE.CircleGeometry(500,50);
    mat=new THREE.MeshBasicMaterial({color: 0x0000ff});
    var mesh = new THREE.Mesh( geo, mat );
    this.scene.add( mesh );

    this.r=r;
  }
  Renderer.prototype.enterlock=function() {
    this.r.domElement.requestPointerLock();
  };
  Renderer.prototype.exitlock=function() {

  };
  Renderer.prototype.winresize=function() {

    var w=window.innerWidth,h=window.innerHeight;

    var max=this.res;
    if(w>max.x||h>max.y) {
      if(w/max.x>h/max.y) {
        var r=w/max.x;
        w=max.x;
        h=Math.round(h/r);
      } else {
        var r=h/max.y;
        h=max.y;
        w=Math.round(w/r);
      }
    }
    this.r.setSize( w, h );
    this.size={x:w,y:h};
  };
  Renderer.prototype.name='renderer';
  Renderer.prototype.frame=function() {


    this.mesh.rotation.x += 0.005;
    this.mesh.rotation.y += 0.01;
    //TODO adjust based on rounding of w/h?
    this.camera.aspect = this.size.x/this.size.y;
    this.camera.updateProjectionMatrix();
    this.r.render( this.scene, this.camera );

  };

  return Renderer;
});
