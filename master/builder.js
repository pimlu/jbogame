var config=require('../config.js');


var
  au=149597870700,//m
  pc=3.26163344,//ly
  re=6378100,//m
  ld=384400*1000,//m
  lr=1737.10*1000;//m
module.exports=function(debug,knex) {
  debug('build');

  function body(o) {
    return knex('bodies').returning('id').insert({
      r:o.r,
      rocky:o.rocky
    }).then(function(bodyid) {
      var columns={
        systemid:o.system[0],
        name:o.name,
        orbiting:true,
        x:o.x,y:o.y,z:o.z,
        bodyid:bodyid[0]
      };
      if(o.parent) columns.parentid=o.parent[0];
      return knex('places').returning('id').insert(columns);
    });
  }

  knex('systems').returning('id').insert({
    name:'sol',
    loadavg:1,
    x:0,y:0,z:0
  }).then(function(id) {
    return body({
      system:id,
      name:'earth',
      rocky:true,
      r:re,
      x:au,y:0,z:0
      }).then(function(bodyid) {
      return body({
        system:id,
        name:'moon',
        rocky:true,
        r:lr,
        x:ld,y:0,z:0,
        parent:bodyid
      });
    });
  }).then(function() {
    return knex('systems').returning('id').insert({
      name:'alpha centauri',
      loadavg:0.5,
      x:4,y:0,z:0
    });
  }).then(function(id) {
    body({
      system:id,
      name:'alpha centauri Ab',
      rocky:true,
      r:re*4,
      x:au*1.2,y:0,z:0
    });
  });
};
