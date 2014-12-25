define(['jquery','./dialogs'],function($,dialogs) {
  function HUD(ro,renderer) {
    //set up DOM stuff
    this.elem=renderer.elem;
    this.overlay=$('<div>').addClass('overlay');
    $(this.elem).append(this.overlay);
    this.logout();
  }
  HUD.prototype.dialogs=dialogs;
  HUD.prototype.logout=function() {
    $('.ui-dialog-content').dialog('close');
    this.overlay.html('');
    //this.dialogs.alert('alerttest','lang');
    this.dialogs.plsplay();
  };
  HUD.prototype.login=function() {
  };
  return HUD;
});
