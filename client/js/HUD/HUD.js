define(['./windows'],function(windows) {
  function HUD(all,renderer) {
    //set up DOM stuff
    this.all=all;
    this.elem=renderer.elem;
    this.dialogs=windows(all);
    this.overlay=$('<div>').addClass('overlay');
    $(this.elem).append(this.overlay);
    this.reset();
  }
  HUD.prototype.reset=function() {
    $('.ui-dialog-content').dialog('close');
    this.overlay.html('');
    this.dialogs.play();
  };
  HUD.prototype.auth=function() {
    $('#dlogin').dialog('close');
    this.dialogs.auth();
  };
  HUD.prototype.setup=function(auth) {
    $('#dauth').dialog('close');
    this.dialogs.chat();
  };
  return HUD;
});
