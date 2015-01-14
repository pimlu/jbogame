var config=require('../config'),
  Promise=require('bluebird'),
  redis=require('then-redis'),
  crypto=require('crypto'),
  rb=Promise.promisify(crypto.randomBytes),
  tools=require('../shared/knexutils.js'),
  checkpass=require('./checkpass.js');

module.exports=function(knex,rdcl) {
  tools=tools(knex);
  var len=config.front.tokenl;
  return function(req,res) {
    var body=req.body;
    var feedback;
    //check if name matches pass
    checkpass(knex,body.name,body.pass).then(function(user) {
      if(!user) {
        feedback={token:null};
        return;
      }
      //reset brute tries
      req.brute.reset();
      return rb(len).then(function(data) {
        var token=data.toString('base64');
        feedback={id:user.id,token:token};
        return rdcl.setex('user:'+user.id+':token',10,token);
      }).then(function() {
        //get the system the user's in from his current ent
        return knex('systems').select('name').where('id',
          tools.subq(knex('ents').select('systemid').where('id',user.entid))
        ).then(function(sysname) {
          feedback.system=sysname[0].name;
          //this one's mostly for convenience
          return rdcl.setex('user:'+user.id+':system',10,feedback.system);
        });
      });
    }).then(function() {
      res.send(feedback);
    });
  };
};
