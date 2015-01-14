define(function() {
  return function(dialogs,div,all) {

    dialogs.play=function() {
      var d=div('[[login.play]]<br/>'+
      '<button id="guest">[[login.guest]]</button><br/>'+
      '<button id="login">[[login.login]]</button><br/>'+
      '[[login.username]]: <input type="text" id="name"/><br/>'+
      '[[login.password]]: <input type="password" id="pass"/><br/>');
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
          title:'login.welcome',
          closeable:false,
          resizable:false
        }
      };
    };//play
  };
});
