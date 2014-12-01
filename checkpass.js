var Promise=require('bluebird'),
bcrypt=require('bcrypt'),
comparep=Promise.promisify(bcrypt.compare);
module.exports=function(knex,name,pass) {
  return knex('users').select('pass').limit(1).where('name',name).then(function(row) {
    return row.length===0?false:comparep(pass,row[0]['pass']);
  });
};
