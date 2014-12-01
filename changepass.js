var Promise=require('bluebird'),
  bcrypt=require('bcrypt'),
  hashp=Promise.promisify(bcrypt.hash),
  checkpass=require('./checkpass.js'),
  validnewpass=require('./shared/js/validnewpass.js');
module.exports=function(knex) {
  return function(req, res) {
    var body=req.body;
    var feedback=validnewpass(body.opass,body.pass,body.pass2);
    //if it's trivially bad, reply back
    if(!feedback[0]) {
      res.send(feedback);
    } else {
      //check if name matches pass
      return checkpass(knex,body.name,body.opass).then(function(correct) {
        if(!correct) {
          feedback=[false,'username/old password do not match'];
        } else {//if it does, update password
          return hashp(body.pass,10).then(function(hash) {
            return knex('users').update({pass:hash,changedpass:knex.raw('now()'),ip:req.ip});
          });
        }
      }).then(function() {
        res.send(feedback);
      });
    }
  };
};
