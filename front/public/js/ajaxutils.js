function ajaxerror(e) {
  if (e.status === 0) return 'network error: unable to connect to server';
  if (e.status === 429) return 'You\'re doing that too much. Try again in ' + datediff(new Date, new Date(e.responseJSON.error.nextValidRequestDate));
  return e.status + ' ' + e.statusText;
}

function datediff(date, date2) {
  var div = [1000, 60];
  var unit = ['ms', 'seconds', 'minutes'];
  var t = date2 - date;
  for (var i = 0; i < div.length; i++) {
    if (t < div[i]) return t.toFixed(1) + ' ' + unit[i];
    t /= div[i] || 1;
  }
  return t.toFixed(1) + ' ' + unit[unit.length - 1];
}

function writefb(color, txt) {
  $('#feedback').css('color', color).html(txt);
}

function wipepass(ids) {
  $('input').attr('disabled', 'disabled');
  var elems = ids.split(',');
  for (var i in elems) {
    var e = $('#' + elems[i]);
    e.val(e.val().replace(/./g, '*'));
  }
}