define(function() {
  return function(dialogs,div,all) {

    dialogs.plsplay=function() {
      var d=div('[[plsplay]]<br/>'+
      '<button id="guest">[[guest]]</button><br/>'+
      '<button id="login">[[login]]</button><br/>'+
      '[[username]]: <input type="text" id="name"/><br/>'+
      '[[password]]: <input type="password" id="pass"/><br/>');
      var submitting=false;
      d.children('#login').click(function() {
        if(!submitting) submitting=true;
        var name=d.children('#name').val();
        var qs={name:name,pass:d.children('#pass').val()};
        $.post('/auth',qs).done(function(data) {
          if(!data.token) return;
          data.name=name;
          //if it was a success
          d.dialog('close');
          all.game.auth(data);
        }).complete(function() {
          submitting=false;
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
    };//plsplay
  };
});
