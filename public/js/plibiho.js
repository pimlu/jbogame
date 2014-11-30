$(function() {
  $('input:text').bind('keypress keydown keyup',function(e) {
    if(e.keyCode == 13) {
      e.preventDefault();
    }
  });
  $('#signup').submit(function(e) {
    e.preventDefault();
    submit();
  });
});
//pevent double submitting
var pending=false;
function submit() {
  if(pending) return;
  pending=true;
  var name=$('#name').val(),
    pass=$('#pass').val(),
    pass2=$('#pass2').val();
  var feedback=validateuser(name,pass,pass2);
  if(feedback[0]) {
    $('#feedback').css('color','').html('signing up...');
    $.post('/register',{name:name,pass:pass,pass2:pass2}).done(function(data) {
      //$( "#feedback" ).html( data );
      writefb(data[0]?'green':'red',data[1]);
      if(data[0]) $('input').attr('disabled','disabled');
      else pending=false;
    });
  } else {

    writefb('red',feeback)
  }
}
function writefb(color,txt) {
  $('#feedback').css('color',color).html(txt);
}
