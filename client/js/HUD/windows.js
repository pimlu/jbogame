define(['lodash','jquery','jquery-ui/dialog','./dialogs'],function(_,$,ui,dialogs_) {
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
  return function(all) {
    //our dialog windows, of all sorts
    var dialogs=dialogs_(all);

    for(var i in dialogs) {
      //use anonymous function so that our loop scopes properly
      (function(dialog) {
        dialogs[i]=function() {
          var options={
            appendTo:'.overlay',
            close:function() {
              $(this).dialog('destroy').remove();
            }
          };
          var div=dialog.apply(null,arguments);
          //if it's not a jquery object- AKA, we're handing in options too
          if(!('jquery' in div)) {
            //if we want scripts to control when it goes away
            if(div.o.closeable===false) {
              delete div.o.closeable;
              div.o.closeOnEscape=false;
              if(div.o.dialogClass) div.o.dialogClass+=' no-close';
              else div.o.dialogClass='no-close';
            }
            //localized title
            if('title' in div.o) {
              div.o.title='<x-t n="'+div.o.title+'"></x-t>';
            }
            //blab our custom options onto the defaults
            _.extend(options,div.o);
            div=div.div;
          }
          div.dialog(options).parents('.ui-dialog')
            .draggable({snap:true,containment:'parent'});
        }
      })(dialogs[i]);
    }
    return dialogs;
  }
});
