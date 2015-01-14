define(['./windows'],function(windows) {
  function HUD(all,renderer) {
    //set up DOM stuff
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
  return HUD;
});
