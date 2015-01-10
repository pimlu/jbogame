define(['jquery','./windows'],function($,windows) {
  function HUD(all,renderer) {
    //set up DOM stuff
    this.elem=renderer.elem;
    this.dialogs=windows(all);
    this.overlay=$('<div>').addClass('overlay');
    $(this.elem).append(this.overlay);
    this.logout();
  }
  HUD.prototype.logout=function() {
    $('.ui-dialog-content').dialog('close');
    this.overlay.html('');
    this.dialogs.plsplay();
    //this.dialogs.attrtest();
  };
  return HUD;
});
