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
    //we don't ever want this to go into hash table mode lol
    var all=this.all={
      game:this,
      res:this.res,
      debug:this.debug||false,
      session:{},
      state:{}
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
      name:data.name,
      fresh:true
    };
    all.state={
      system:data.system,
      token:data.token
    };
    handshake(all,this.connect.bind(this),this.discon.bind(this));
  };
  Game.prototype.connect=function() {
    console.log('connect');
    var session=this.all.session;
    if(session.fresh) {
      session.fresh=false;
    }
  };
  Game.prototype.discon=function(e) {
    console.log('close',e);
    var hopping=e.code===4000;
    var self=this;
    function clean() {
      self.session={};
      self.state={};
    }
    function leavemsg(name,title,o) {
      clean();
      var newo={buttons:[{
        name:'core.okay',
        click:function() {
          this.dialog('close');
          //repoen login window
          self.hud.reset();
        }
        }]};
      Object.assign(newo,o);
      self.hud.dialogs.alert(name,title,newo);
    }
    if(!e.wasClean||e.code===1000) {
      leavemsg('login.dirtyclose','login.connectionlost',{ecode:e.code});
    } else if(e.code===4001) {
      leavemsg('login.kicked','login.connectionlost',{reason:e.reason});
    } else if(e.code===4000) {
      clean();
      this.hud.reset();
    }
  }
  return Game;
});
