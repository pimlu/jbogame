define([], function() {
  /*our html preprocessor
  [[str]]: <x-t n="str"></x-t>
  [[str foo="bar"]]: <x-t n="str" foo="bar"></x-t>
  */
  return function div(inner, id) {
    var idattr = id ? ' id="' + id + '"' : '';
    return $('<div' + idattr + '>').html(
      inner.replace(/\[\[([^ ]*?)\]\]/g, '<x-t n="$1"></x-t>')
      .replace(/\[\[([^ ]*?) (.*?)\]\]/g, '<x-t n="$1" $2></x-t>')
    );
  };
});