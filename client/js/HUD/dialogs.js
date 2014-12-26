define(['lodash','jquery','jquery-ui/dialog','../utils'],function(_,$,ui,utils) {
  //our dialog windows, of all sorts
  var dialogs={
    alert:function(name,title,o) {
      return div('<x-t n="'+name+'"'+kv(o)+'></x-t>')
      .attr('title','<x-t n="'+title+'"></x-t>');
    },
    attrtest:function() {
      return div('<x-t n="attrtest" number="123"></x-t>');
    },
    plsplay:function() {
      var d=div('<x-t n="plsplay"></x-t><br/>'+
        '<button id="guest"><x-t n="guest"></x-t></button><br/>'+
        '<button id="login"><x-t n="login"></x-t></button><br/>'+
        '<x-t n="username"></x-t>: <input type="text" id="name"/><br/>'+
        '<x-t n="password"></x-t>: <input type="password" id="pass"/><br/>');
      d.children('#login').click(function() {
        var qs={name:d.children('#name').val(),pass:d.children('#pass').val()};
        $.post('/auth',qs).done(function(data) {
          console.log(data.token);
          if(data.token) d.dialog('close');
        });
      });
      return d;
    },
  };

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

  for(var i in dialogs) {
    //use anonymous function so that our loop scopes properly
    (function(div) {
      dialogs[i]=function() {
        div.apply(null,arguments).dialog({appendTo:'.overlay'});
      }
    })(dialogs[i]);
  }
  return dialogs;
});
