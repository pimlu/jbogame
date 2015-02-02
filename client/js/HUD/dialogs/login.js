define(['../div'], function(div) {
  var login = {};
  login.auth = function() {
    return {
      div: div('[[login.auth]]', 'dauth'),
      closeable: false
    };
  };
  login.play = function(all) {
    var d = div('[[login.play]]<br/>' + '<table style="margin:0.7em 0"><tr>' + '<td>[[login.username]]:</td><td><input type="text" id="name"/></td>' + '</tr><tr>' + '<td>[[login.password]]:</td><td><input type="password" id="pass"/></td>' + '</tr></table>' + '<button id="login">[[login.login]]</button> ' + '<button id="guest">[[login.guest]]</button>' + '<x-t n="nbsp" id="feedback" class="logfb"></x-t>', 'dlogin');
    var submitting = false;
    var feedback = d.find('#feedback');

    d.children('#login').click(function() {
      if (!submitting) submitting = true;
      var name = d.find('#name').val();
      var qs = {
        name: name,
        pass: d.find('#pass').val()
      };
      feedback.attr('n', 'login.auth').removeClass('red');
      $.post('/auth', qs).done(function(data) {
        if (!data.token) {
          feedback.attr('n', 'login.badpass');
          return;
        }
        //if it was a success
        data.name = name;
        all.game.auth(data);
      }).fail(function(data) {
        feedback.attr('n', 'login.authfail');
      }).complete(function() {
        submitting = false;
      });
    });
    return {
      div: d,
      title: 'login.welcome',
      closeable: false,
      resizable: false
    };
  }; //play
  return login;
});