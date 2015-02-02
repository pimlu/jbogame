define(['../div'],function(div) {

  return {
    box:function(user) {
      var d=div('[[chat.box]]');

      return {
        div:d,
        o:{
          title:'chat.title',
          closeable:false
        }
      };
    }
  };

});
