var config=require('../config'),
  Promise=require('bluebird'),
  crypto=require('crypto'),
  rb=Promise.promisify(crypto.randomBytes),
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
        //TODO: store token in redis
        return rb(32).then(function(data) {
          feedback={token:data.toString('base64')};
        });
      }
    }).then(function() {
      res.send(feedback);
    });
  };
};
