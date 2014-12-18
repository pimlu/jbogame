define(['./Localizer','./Controls','./Renderer'],
function(Localizer,Controls,Renderer) {
  function Game(o) {
    var defaults={
      directory:{},
      res:{x:800,y:600},
      debug:false
    };
    for(var i in defaults) this[i]=defaults[i];
    for(var i in o) this[i]=o[i];
    this.localizer=new Localizer('en','jbo');
    this.controls=new Controls({game:this});
    var ro={
      game:this,
      res:this.res,
      debug:this.debug
    };
    this.renderer=new Renderer(ro);
    this.localizer.trigger();
    this.frame();
  }
  Game.prototype.register=function(name,value) {
    this.directory[name]=value;
    var self=this;
    value.send=function(to,data) {
      self.message(name,to,data);
    };
  };
  Game.prototype.lookup=function(name) {
    return this.directory[name];
  };
  Game.prototype.message=function(from,to,data) {
    this.directory[to].recv(from,data);
  };
  Game.prototype.frame=function() {
    requestAnimationFrame( this.frame.bind(this) );
    this.renderer.frame();
  };
  return Game;
});
