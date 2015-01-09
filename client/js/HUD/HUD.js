define(['jquery','./windows'],function($,windows) {
  function HUD(all,renderer) {
    //set up DOM stuff
    this.elem=renderer.elem;
    this.dialogs=windows(all);
    this.overlay=$('<div>').addClass('overlay');
    $(this.elem).append(this.overlay);
    this.logout();
    all.ps.subscribe('login',this.login.bind(this));
  }
  HUD.prototype.logout=function() {
    $('.ui-dialog-content').dialog('close');
    this.overlay.html('');
    this.dialogs.plsplay();
    //this.dialogs.attrtest();
  };
  HUD.prototype.login=function(msg,data) {
  };
  return HUD;
});
