define(['log', 'Controls', 'Renderer', 'HUD/HUD', 'handshake', 'TimeSync', 'phys'],
  function(log, Controls, Renderer, HUD, handshake, TimeSync, phys) {
    function Game(o) {
      var defaults = {
        directory: {},
        res: {
          x: 800,
          y: 600
        },
        debug: true,
        level: 'trace'
      };
      for (var i in defaults) this[i] = defaults[i];
      for (var i in o) this[i] = o[i];

      if (this.debug) {
        log.setLevel(this.level);
        log.info('debug');
      } else {
        log.setLevel(log.levels.SILENT);
      }

      //important information to give to every component
      //we don't ever want this to go into hash table mode lol
      var all = this.all = {
        game: this,
        res: this.res,
        debug: this.debug || false,
        session: null,
        state: null
      };
      this.controls = new Controls(all);
      this.renderer = new Renderer(all);
      this.hud = new HUD(all, this.renderer);
      this.frame();
    }
    Game.prototype.frame = function() {
      requestAnimationFrame(this.frame.bind(this));
      this.renderer.frame();
    };
    //gets called by the login dialog
    Game.prototype.auth = function(data) {
      this.hud.auth();
      log.debug(data);
      var all = this.all;
      all.session = {
        id: data.id,
        name: data.name,
        fresh: true
      };
      all.state = {
        system: data.system,
        token: data.token
      };
      var tsync = new TimeSync(all, this.setup.bind(this));
      handshake(all, tsync.connect.bind(tsync), tsync.message.bind(tsync), this.discon.bind(this));
    };
    Game.prototype.setup = function() {
      this.hud.setup();
      var ws = this.all.state.ws;
      ws.onmessage(this.message.bind(this));

      var session = this.all.session,
        state = this.all.state;
      if (session.fresh) {
        session.fresh = false;
      }
    };
    Game.prototype.message = function(msg) {
      log.debug(msg);
    };
    Game.prototype.discon = function(e) {
      var hopping = e.code === 4000;
      var all = this.all,
        self = this;
      //creates a dialog with an ok that takes you to login
      function leavemsg(name, title, args) {
        all.session = null;
        all.state = null;
        var o = {
          buttons: [{
            name: 'core.okay',
            click: function() {
              this.dialog('close');
              //repoen login window
              self.hud.reset();
            }
          }]
        };
        self.hud.dialogs.core.alert(name, title, args, o);
      }
      if (!e.wasClean || e.code === 1000) {
        leavemsg(all.session.fresh ? 'login.failclose' : 'login.dirtyclose',
          'login.connectionlost', {
            system: all.state.system,
            ecode: e.code
          });
      } else if (e.code === 4001) {
        leavemsg('login.kicked', 'login.connectionlost', {
          reason: e.reason
        });
      } else if (e.code === 4000) {
        all.state = null;
      }
    }
    return Game;
  });
