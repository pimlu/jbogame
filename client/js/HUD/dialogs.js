define(function() {
  /*our html preprocessor
  [[str]]: <x-t n="str"></x-t>
  [[str foo="bar"]]: <x-t n="str" foo="bar"></x-t>
  */
  function div(inner) {
    return $('<div>').html(
      inner.replace(/\[\[([^ ]*?)\]\]/g,'<x-t n="$1"></x-t>')
      .replace(/\[\[([^ ]*?) (.*?)\]\]/g,'<x-t n="$1" $2></x-t>')
    );
  }
  //html key value pairs
  function kv(o) {
    var str='';
    for(var k in o) {
      str+=' '+k+'="'+o[k]+'"';
    }
    return str;
  }
  return function(all) {
    var dialogs= {
      alert:function(name,title,o) {
        return {
          div:div('[['+name+kv(o)+']]'),
          o:{title:title}
        };
      },
      attrtest:function() {
        return div('[[attrtest number="123"]]');
      },
      plsplay:function() {
        var d=div('[[plsplay]]<br/>'+
        '<button id="guest">[[guest]]</button><br/>'+
        '<button id="login">[[login]]</button><br/>'+
        '[[username]]: <input type="text" id="name"/><br/>'+
        '[[password]]: <input type="password" id="pass"/><br/>');
        d.children('#login').click(function() {
          var name=d.children('#name').val();
          var qs={name:name,pass:d.children('#pass').val()};
          $.post('/auth',qs).done(function(data) {
            console.log(data);
            if(!data.token) return;
            //if it was a success
            d.dialog('close');
            all.ps.publish('login.user',{name:name,token:data.token});
          });
        });
        return {
          div:d,
          o:{
            title:'welcome',
            closeable:false,
            resizable:false
          }
        };
      },
    };
    return dialogs;
  };
});
