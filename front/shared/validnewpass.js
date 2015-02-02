(function() {
  if (typeof module === 'undefined') validnewpass = exportfn;
  else module.exports = exportfn;

  function exportfn(opass, pass, pass2) {
    if (pass !== pass2) {
      return [false, 'new passwords do not match'];
    } else if (pass.length < 8) {
      return [false, 'new password is too short'];
    } else if (opass === pass) {
      return [false, 'new password is the same as the old one'];
    }
    return [true, 'password successfully changed'];
  }
})();