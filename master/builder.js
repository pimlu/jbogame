var config=require('../config.js');


var
  au=149597870700,//m
  pc=3.26163344,//ly
  re=6378100,//m
  ld=384400*1000,//m
  lr=1737.10*1000;//m
module.exports=function(debug,knex) {
  debug('build');

  function body(system,name,rocky,r,x,y,z,parent) {
    return knex('bodies').returning('id').insert({
      r:r,
      rocky:rocky
    }).then(function(bodyid) {
      var columns={
        systemid:system[0],
        name:name,
        orbiting:true,
        x:x,y:y,z:z,
        bodyid:bodyid[0]
      };
      if(parent) columns.parentid=parent[0];
      return knex('places').returning('id').insert(columns);
    });
  }

  knex('systems').returning('id').insert({
    name:'sol',
    loadavg:1,
    x:0,y:0,z:0
  }).then(function(id) {
    return body(id,'earth',true,re,au,0,0).then(function(bodyid) {
      return body(id,'moon',true,lr,ld,0,0,bodyid);
    });
  }).then(function() {
    return knex('systems').returning('id').insert({
      name:'alpha centauri',
      loadavg:0.5,
      x:4,y:0,z:0
    });
  }).then(function(id) {
    body(id,'alpha centauri Ab',true,re*4,au*1.2,0,0);
  });
};
