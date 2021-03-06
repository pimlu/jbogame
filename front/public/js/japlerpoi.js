$(function() {
  $('input').removeAttr('disabled');
  $('input:text').bind('keypress keydown keyup',function(e) {
    if(e.keyCode == 13) {
      e.preventDefault();
    }
  });
  $('#change').submit(function(e) {
    e.preventDefault();
    submit();
  });
});
//pevent double submitting
var pending=false;
function submit() {
  if(pending) return;
  var name=$('#name').val(),
  opass=$('#opass').val(),
  pass=$('#pass').val(),
  pass2=$('#pass2').val();
  var feedback=validnewpass(opass,pass,pass2);
  //if it went well, poke the server
  if(feedback[0]) {
    $('#feedback').css('color','').html('changing password...');
    pending=true;
    //give the server's final feedback
    $.post('/changepass',{name:name,opass:opass,pass:pass,pass2:pass2}).done(function(data) {
      writefb(data[0]?'green':'red',data[1]);
      if(data[0]) wipepass('opass,pass,pass2');
    }).fail(function(e) {
      writefb('red',ajaxerror(e));
    }).always(function() {
      pending=false;
    });
  } else {//else yell the problem
    writefb('red',feedback)
  }
}
