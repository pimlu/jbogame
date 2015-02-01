//TODO automate these arguments
define(['./dialogs/alert','./dialogs/login','./dialogs/chat'],
function(alert_,login,chat) {
  /*our html preprocessor
  [[str]]: <x-t n="str"></x-t>
  [[str foo="bar"]]: <x-t n="str" foo="bar"></x-t>
  */
  function div(inner,id) {
    var idattr=id?' id="'+id+'"':'';
    return $('<div'+idattr+'>').html(
      inner.replace(/\[\[([^ ]*?)\]\]/g,'<x-t n="$1"></x-t>')
      .replace(/\[\[([^ ]*?) (.*?)\]\]/g,'<x-t n="$1" $2></x-t>')
    );
  }
  return function(all) {
    var dialogs={};
    //TODO automate these arguments!!!
    alert_(dialogs,div,all);
    login(dialogs,div,all);
    chat(dialogs,div,all);
    return dialogs;
  };
});
