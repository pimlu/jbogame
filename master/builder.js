var config=require('../config.js');


var
  au=149597870700,//m
  pc=3.26163344,//ly
  re=6378100;//m
module.exports=function(debug,knex) {
  debug('build');
  knex('systems').returning('id').insert({
    name:'sol',
    loadavg:1,
    x:0,y:0,z:0
  }).then(function(id) {
    return knex('bodies').returning('id').insert({
      r:re,
      rocky:true
    }).then(function(bodyid) {
      return knex('places').insert({
        systemid:id[0],
        name:'earth',
        orbiting:true,
        x:au,y:0,z:0,
        bodyid:bodyid[0]
      });
    });
  }).then(function() {
    return knex('systems').insert({
      name:'alpha centauri',
      loadavg:0.5,
      x:4,y:0,z:0
    })
  });
};
