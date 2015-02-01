define(function() {
  return function(dialogs,div,all) {
    dialogs.auth=function() {
      return {
        div:div('[[login.auth]]','dauth'),
        closeable:false
      };
    };
    dialogs.play=function() {
      var d=div('[[login.play]]<br/>'
      +'<button id="guest">[[login.guest]]</button><br/>'
      +'<button id="login">[[login.login]]</button><br/>'
      +'[[login.username]]: <input type="text" id="name"/><br/>'
      +'[[login.password]]: <input type="password" id="pass"/><br/>'
      ,'dlogin');
      var submitting=false;
      d.children('#login').click(function() {
        if(!submitting) submitting=true;
        var name=d.children('#name').val();
        var qs={name:name,pass:d.children('#pass').val()};
        $.post('/auth',qs).done(function(data) {
          if(!data.token) return;
          //if it was a success
          data.name=name;
          all.game.auth(data);
        }).complete(function() {
          submitting=false;
        });
      });
      return {
        div:d,
        title:'login.welcome',
        closeable:false,
        resizable:false
      };
    };//play
  };
});
