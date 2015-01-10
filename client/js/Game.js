define(['pubsub','Controls','Renderer','HUD/HUD','handshake'],
function(ps,Controls,Renderer,HUD) {
  function Game(o) {
    var defaults={
      directory:{},
      res:{x:800,y:600},
      debug:false
    };
    for(var i in defaults) this[i]=defaults[i];
    for(var i in o) this[i]=o[i];
    //important information to give to every component
    var all=this.all={
      game:this,
      ps:ps,
      res:this.res,
      debug:this.debug
    };
    this.controls=new Controls(all);
    this.renderer=new Renderer(all);
    this.HUD=new HUD(all,this.renderer);
    this.frame();

    all.ps.subscribe('auth',this.auth.bind(this));
  }
  Game.prototype.frame=function() {
    requestAnimationFrame( this.frame.bind(this) );
    this.renderer.frame();
  };
  Game.prototype.auth=function(msg,data) {
    console.log(data);
    var all=this.all;
    for(i in data) all[i]=data[i];
    handshake(all);
  };
  return Game;
});
