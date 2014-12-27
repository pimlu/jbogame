define(['jquery','./dialogs'],function($,dialogs) {
  function HUD(all,renderer) {
    //set up DOM stuff
    this.elem=renderer.elem;
    this.dialogs=dialogs(all);
    this.overlay=$('<div>').addClass('overlay');
    $(this.elem).append(this.overlay);
    this.logout();
    all.ps.subscribe('login',this.login.bind(this));
  }
  HUD.prototype.logout=function() {
    //TODO proper dialog removal in general
    $('.ui-dialog-content').dialog('close');
    this.overlay.html('');
    //this.dialogs.alert('alerttest','lang');
    this.dialogs.plsplay();
  };
  HUD.prototype.login=function(msg,data) {
  };
  return HUD;
});
