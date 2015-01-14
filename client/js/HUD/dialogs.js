define(['./dialogs/login','./dialogs/test'],function(login,test) {
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
    var dialogs={
      alert:function(name,title,o) {
        o=o||{};
        var dialog=div('[['+name+kv(o)+']]');
        var btndiv;
        //defaults to uncloseable if there's no buttons
        var closeable=true;
        if('buttons' in o) {
          closeable=false;
          //each button has a name and click event
          btndiv=$('<div>');
          var buttons=o.buttons;
          delete o.buttons;
          btndiv.append('<br/>')
          for(var i=0;i<buttons.length;i++) {
            var btn=$('<button>',{
              html:$('<x-t>').attr('n',buttons[i].name),
              click:buttons[i].click.bind(dialog)
              });
            btndiv.append(btn);
          }
          dialog.append(btndiv);
        }
        if('closeable' in o) {
          closeable=o.closeable;
          delete o.closeable;
        }
        return {
          div:dialog,
          o:{title:title,closeable:closeable}
        };
      }
    };
    login(dialogs,div,all);
    test(dialogs,div,all);
    return dialogs;
  };
});
