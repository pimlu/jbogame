define(function() {
  return function(dialogs,div,all) {
    dialogs.chat=function(user) {
      var d=div('[[chat.box]]');

      return {
        div:d,
        o:{
          title:'chat.title',
          closeable:false
        }
      };
    };
  };
});
