define(function() {

  //fixes titles so that they display html instead of escaping
  $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function(title) {
      if (!this.options.title) {
        title.html("&#160;");
      } else {
        title.html(this.options.title);
      }
    }
  }));

  //recursively traverse the dialog tree, calling makedialog() on all the
  //functions inside
  return function setup(o) {
    for (var i in o) {
      if (typeof o[i] === 'object') {
        setup(o[i]);
      } else {
        makedialog(o, o[i], i);
      }
    }
  }

  /*the functions defined in HUD/dialogs/* simply return a div.  makedialog
  replaces this function with one that TAKES that div and makes a dialog out
  of it*/
  function makedialog(dialogs, dialog, i) {
    dialogs[i] = function() {
      var options = {
        appendTo: '.overlay',
        closeOnEscape: false,
        close: function() {
          $(this).dialog('destroy').remove();
        }
      };
      var div = dialog.apply(null, arguments);
      //if it's not a jquery object- AKA, we're handing in options too
      if (!('jquery' in div)) {
        var o = div; //it's not actually a div, it's options
        o.attr = o.attr || {};

        //if we want scripts to control when it goes away
        if (o.closeable === false) {
          if ('dialogClass' in o) options.dialogClass = o.dialogClass + ' no-close';
          else options.dialogClass = 'no-close';
        }
        //localized title- falsy values do nothing
        if (o.title) {
          options.title = '<x-t n="' + o.title + '"></x-t>';
        }
        if ('options' in o) Object.assign(options, o.options);
        //now pull our div back in
        div = o.div;
        for (var i in o.attr || {}) {
          div.attr(i, o.attr[i]);
        }
      }
      div.dialog(options).parents('.ui-dialog')
        .draggable({
          snap: true,
          containment: 'parent'
        });
    }
  }

});