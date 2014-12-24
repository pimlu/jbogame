var localizer;
define(['./locales/locales'],function(locales) {
  if(localizer) return;
  localizer={};
  localizer.cbs=[];
  localizer.primary='en';
  localizer.secondary='jbo';
  var proto = Object.create(HTMLElement.prototype);
  //the second argument just gets the attribute with the given name
  function update() {
    this.innerHTML=localizer.l(this.getAttribute('n'),this.getAttribute.bind(this));
  }
  proto.attachedCallback=proto.attributeChangedCallback=update;
  localizer.xt = document.registerElement('x-t', {prototype: proto});

  localizer.langs=locales;
  /* l: localizes a string.
  getlang: gets the language dictionary for a lang-code.
  setlocale: sets primary and secondary localization.
  l2: localizes a string with primary/secondary language.
  trigger: fires off the list of callbacks. */
  localizer.l=function(n,o) {
    return localizer.langs[localizer.primary][n](localizer.l,o);
  };
  localizer.getlang=function(lang) {
    return localizer.langs[lang];
  };
  localizer.setlocale=function(primary,secondary) {
    if(primary!==localizer.primary) var changed=true;
    localizer.primary=primary;
    localizer.secondary=secondary;
    if(changed) localizer.trigger();
  };
  localizer.l2=function(s) {
    return [localizer.getlang(localizer.primary)[s],
      localizer.getlang(localizer.secondary)[s]];
  };
  localizer.trigger=function() {
    //update every single x-t tag
    [].forEach.bind(document.getElementsByTagName('x-t'))(function(elem) {
      update.apply(elem);
    });
    localizer.cbs.forEach(function(cb){cb();});
  };
  return localizer;
});
