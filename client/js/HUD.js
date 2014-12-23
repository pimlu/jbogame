define(['jquery','jquery-ui/dialog','utils'],function($,ui,utils) {
  function HUD(ro,renderer) {
    //set up DOM stuff
    this.elem=renderer.elem;
    this.overlay=$('<div>').addClass('overlay');
    $(this.elem).append(this.overlay);
    $('<div>').html('login dialog').dialog();
  }
  HUD.prototype.logout=function() {
    this.overlay.html('');
  }
  HUD.prototype.login=function() {
  };
  return HUD;
});
