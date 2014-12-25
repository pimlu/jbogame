var config=require('../config'),
  checkpass=require('./checkpass.js');

module.exports=function(knex) {
  return function(req, res) {
    var body=req.body;
    var feedback;
    //check if name matches pass
    return checkpass(knex,body.name,body.pass).then(function(correct) {
      if(!correct) {
        feedback={token:null};
      } else {
        feedback={token:'success'};
      }
    }).then(function() {
      res.send(feedback);
    });
  };
};
