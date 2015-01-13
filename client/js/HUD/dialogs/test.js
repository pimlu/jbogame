define(function() {
  return function(dialogs,div,all) {
    dialogs.attrtest=function() {
      return div('[[attrtest number="123"]]');
    };
  };
});
