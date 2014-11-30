(function(){
  if(typeof module==='undefined') validateuser=exportfn;
  else module.exports=exportfn;
  function exportfn(name,pass,pass2) {
    if(name.length<4) {
      return [false,'username is too short'];
    } else if(name.length>16) {
      return [false,'username is too long'];
    } else if(!/^[a-z0-9_]*$/.test(name)) {
      return [false,'username contains invalid symbols'];
    } else if(pass!==pass2) {
      return [false,'passwords do not match'];
    } else if(pass.length<8) {
      return [false,'password is too short'];
    }
    return [true,'success, go play now'];
  }
})();
