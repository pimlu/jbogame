var config=require('../config'),
  Promise=require('bluebird'),
  redis=require('redis'),
  crypto=require('crypto'),
  rb=Promise.promisify(crypto.randomBytes),
  checkpass=require('./checkpass.js');

module.exports=function(knex,rdcl) {
  rdcl=Promise.promisifyAll(rdcl);
  var len=config.front.tokenl;
  return function(req,res) {
    var body=req.body;
    var feedback;
    //check if name matches pass
    checkpass(knex,body.name,body.pass).then(function(correct) {
      if(!correct) {
        feedback={token:null};
        return;
      }
      return rb(len).then(function(data) {
        var token=data.toString('base64');
        feedback={token:token};
        console.log(token);
        return rdcl.setexAsync('tokens:'+body.name,60,token);
      });
    }).then(function() {
      res.send(feedback);
    });
  };
};