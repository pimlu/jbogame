define(['Controls','Renderer','HUD/HUD','handshake'],
function(Controls,Renderer,HUD,handshake) {
  function Game(o) {
    var defaults={
      directory:{},
      res:{x:800,y:600},
      debug:true
    };
    for(var i in defaults) this[i]=defaults[i];
    for(var i in o) this[i]=o[i];

    if(this.debug) {
      console.log('debug');
    }

    //important information to give to every component
    var all=this.all={
      game:this,
      res:this.res,
      debug:this.debug||false
    };
    this.controls=new Controls(all);
    this.renderer=new Renderer(all);
    this.hud=new HUD(all,this.renderer);
    this.frame();
  }
  Game.prototype.frame=function() {
    requestAnimationFrame( this.frame.bind(this) );
    this.renderer.frame();
  };
  //gets called by the login dialog
  Game.prototype.auth=function(data) {
    console.log(data);
    var all=this.all;
    all.session={
      id:data.id,
      name:data.name
    };
    all.state={
      system:data.system,
      token:data.token
    };
    handshake(all,this.join.bind(this),this.leave.bind(this));
  };
  Game.prototype.join=function() {
    console.log('join');
    console.log(this.all);
  };
  Game.prototype.leave=function(e) {
    console.log('close',e);
    if(!e.wasClean) {
      this.hud.dialogs.alert('dirtyclose','connectionlost',{ecode:e.code});
    }
  }
  return Game;
});
