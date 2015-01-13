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
    var dialogs= {
      alert:function(name,title,o) {
        return {
          div:div('[['+name+kv(o)+']]'),
          o:{title:title}
        };
      }
    };
    login(dialogs,div,all);
    test(dialogs,div,all);
    return dialogs;
  };
});
