define(['lodash','jquery','jquery-ui/dialog','utils'],function(_,$,ui,utils) {
  //fixes titles so that they display html instead of escaping
  $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function(title) {
      if (!this.options.title ) {
        title.html("&#160;");
      } else {
        title.html(this.options.title);
      }
    }
  }));
  function HUD(ro,renderer) {
    //set up DOM stuff
    this.elem=renderer.elem;
    this.overlay=$('<div>').addClass('overlay');
    $(this.elem).append(this.overlay);
    this.logout();
  }
  function div(inner) {
    return $('<div>').html(inner);
  }
  //html key value pairs
  function kv(o) {
    var str='';
    for(var k in o) {
      str+=' '+k+'="'+o[k]+'"';
    }
    return str;
  }
  //our dialog windows, of all sorts
  var dialogs=HUD.prototype.dialogs={
    alert:function(name,title,o) {
      return div('<x-t n="'+name+'"'+kv(o)+'></x-t>')
        .attr('title','<x-t n="'+title+'"></x-t>');
    },
    attrtest:function() {
      return div('<x-t n="attrtest" number="123"></x-t>');
    },
    login:function() {
      return div('<x-t n="login"></x-t>');
    },
  };

  for(var i in dialogs) {
    //use anonymous function so that our loop scopes properly
    (function(div) {
      dialogs[i]=function() {
        div.apply(null,arguments).dialog({appendTo:'.overlay'});
      }
    })(dialogs[i]);
  }
  HUD.prototype.logout=function() {
    $('.ui-dialog-content').dialog('close');
    this.overlay.html('');
    //this.dialogs.alert('alerttest','lang');
    this.dialogs.login();
  };
  HUD.prototype.login=function() {
  };
  return HUD;
});
