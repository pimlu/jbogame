var localizer;
define(['./locales/locales'], function(locales) {
  if (localizer) return;
  localizer = {};
  localizer.cbs = [];
  localizer.primary = 'en';
  localizer.secondary = 'jbo';

  //the second argument just gets the attribute with the given name
  function update() {
    this.innerHTML = localizer.l(this.getAttribute('n'), this.getAttribute.bind(this));
  }

  function register(name, type, ext) {
    var elem = Object.create(type.prototype);
    elem.attachedCallback = elem.attributeChangedCallback = update;
    localizer[name] = document.registerElement(name, {
      prototype: elem
    }, ext);
  }
  register('x-t', HTMLElement);

  localizer.langs = locales;
  /* l: localizes a string.
  getlang: gets the language dictionary for a lang-code.
  setlocale: sets primary and secondary localization.
  l2: localizes a string with primary/secondary language.
  trigger: fires off the list of callbacks. */
  localizer.l = function(n, o) {
    function red(txt) {
      return '<span style="color:red">' + txt + '</span>';
    }
    if (n === null) return red('n is missing');
    else if (n === '') return '';
    else if (n === 'nbsp') return '&nbsp;';
    //follow the object chain using dots
    var keys = n.split('.');
    var curval = localizer.langs[localizer.primary];
    for (var i = 0; i < keys.length; i++) {
      if (!(keys[i] in curval))
        return red(n);
      curval = curval[keys[i]];
    }
    return curval(localizer.l, o);
  };
  localizer.getlang = function(lang) {
    return localizer.langs[lang];
  };
  localizer.setlocale = function(primary, secondary) {
    if (primary !== localizer.primary) var changed = true;
    localizer.primary = primary;
    localizer.secondary = secondary;
    if (changed) localizer.trigger();
  };
  //mostly for debugging purposes
  localizer.swap = function() {
    localizer.setlocale(localizer.secondary, localizer.primary);
  }
  localizer.l2 = function(s) {
    return [localizer.getlang(localizer.primary)[s],
      localizer.getlang(localizer.secondary)[s]
    ];
  };
  localizer.trigger = function() {
    //update every single x-t tag
    [].forEach.bind(document.getElementsByTagName('x-t'))(function(elem) {
      update.apply(elem);
    });
    localizer.cbs.forEach(function(cb) {
      cb();
    });
  };
  return localizer;
});