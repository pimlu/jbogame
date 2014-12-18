define(function() {
  function Localizer(primary,secondary) {
    this.primary=primary;
    this.secondary=secondary;
    this.cbs=[];
  }
  Localizer.langs={
    en: {
      lang:'language',
      langname:'English',
      blocker:'Click to play (WASD)'
    },
    jbo: {
      lang:'bangu',
      langname:'lojbo',
      blocker:'kliku fi lonu kelci (WASD)'
    },
  };
  /* l: localizes a string.
  getlang: gets the language dictionary for a lang-code.
  setlocale: sets primary and secondary localization.
  l2: localizes a string with primary/secondary language.
  trigger: fires off the list of callbacks. */
  Localizer.prototype.l=function(s) {
    return Localizer.langs[this.primary][s];
  };
  Localizer.prototype.getlang=function(l) {
    return Localizer.langs[l];
  };
  Localizer.prototype.setlocale=function(primary,secondary) {
    if(primary!==this.primary) var changed=true;
    this.primary=primary;
    this.secondary=secondary;
    if(changed) this.trigger();
  };
  Localizer.prototype.l2=function(s) {
    return [this.getlang(this.primary)[s],
      this.getlang(this.secondary)[s]];
  };
  Localizer.prototype.trigger=function() {
    this.cbs.forEach(function(cb){cb();});
  };
  return Localizer;
});
