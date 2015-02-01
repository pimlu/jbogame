define(function() {

  //html key value pairs
  function kv(o) {
    var str='';
    for(var k in o) {
      str+=' '+k+'="'+o[k]+'"';
    }
    return str;
  }

  return function(dialogs,div,all) {

    dialogs.alert=function(name,title,args,o) {
      o=o||{};
      var dialog=div('[['+name+kv(args||{})+']]');
      var btndiv;
      //defaults to uncloseable if there's no buttons
      var closeable=true;
      if('buttons' in o) {
        closeable=false;
        //each button has a name and click event
        btndiv=$('<div>');
        var buttons=o.buttons;
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
      }
      return {
        div:dialog,
        title:title,
        closeable:closeable,
        attr:o.attr||{}
      };
    }
  };
});
