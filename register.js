var Promise=require('bluebird'),
  bcrypt=require('bcrypt'),
  hashp=Promise.promisify(bcrypt.hash);
var validateuser=require('./shared/js/validuser.js');
module.exports=function(knex) {
  return function(req, res) {
    var body=req.body;
    var feedback=validateuser(body.name,body.pass,body.pass2);
    //if it's trivially bad, reply back
    if(!feedback[0]) {
      res.send(feedback);
    } else {
      //check if name already exists
      knex('users').select(1).limit(1).where('name',body.name).then(function(row) {
        if(row.length===1) {
          feedback=[false,'user already exists'];
        } else {//if it doesn't, hash and insert
          return hashp(body.pass,10).then(function(hash) {
            return knex('users').insert({name:body.name,pass:hash,ip:req.ip});
          });
        }
      }).then(function(){
        res.send(feedback);
      });
    }
  };
};
