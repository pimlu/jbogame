define({
  welcome:"fi'i",
  play:".ui zanvi'e fi la zdelu .i ko vitke gi'onai cmisau",
  auth:"ca'a jorne troci ...",
  connectionlost:"co'u jorne",
  failclose:function(l,o) {
    return ".i fliba loka jorne la ."+o('system')+". .i srera tu'a li "+o('ecode');
  },
  dirtyclose:function(l,o) {
    return ".i co'u jorne lo samse'u .i srera tu'a li "+o('ecode');
  },
  kicked:function(l,o) {
    return ".i do pu se tikpa pe'a ki'u la'o gy "+o('reason')+" gy";
  },
  guest:"vitke",
  login:"cmisau",
  username:"cmene",
  password:"japyvla"
});
