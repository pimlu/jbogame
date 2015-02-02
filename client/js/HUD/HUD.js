define(['./dialogs'], function(dialogs) {
  function HUD(all, renderer) {
    //set up DOM stuff
    this.all = all;
    this.elem = renderer.elem;
    this.dialogs = dialogs;
    this.overlay = $('<div>').addClass('overlay');
    $(this.elem).append(this.overlay);
    this.reset();
  }
  HUD.prototype.reset = function() {
    $('.ui-dialog-content').dialog('close');
    this.overlay.html('');
    this.dialogs.login.play(this.all);
  };
  HUD.prototype.auth = function() {
    $('#dlogin').dialog('close');
    this.dialogs.login.auth();
  };
  HUD.prototype.setup = function(auth) {
    $('#dauth').dialog('close');
    this.dialogs.chat.box();
  };
  return HUD;
});