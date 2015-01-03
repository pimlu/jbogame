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
        x:o.pos[0],y:o.pos[1],z:o.pos[2],
        bodyid:bodyid[0]
      };
      if(o.parent) columns.parentid=o.parent[0];
      return knex('places').returning('id').insert(columns);
    });
  }
  function system(o) {
    return knex('systems').returning('id').insert({
      name:o.name,
      loadavg:o.loadavg,
      x:o.pos[0],y:o.pos[1],z:o.pos[2]
    });
  }

  system({
    name:'sol',
    loadavg:1,
    pos:[0,0,0]
    }).then(function(id) {
    return body({
      system:id,
      name:'earth',
      rocky:true,
      r:re,
      pos:[au,0,0]
      }).then(function(bodyid) {
      return body({
        system:id,
        name:'moon',
        rocky:true,
        r:lr,
        pos:[ld,0,0],
        parent:bodyid
      });
    });
  }).then(function() {
    return system({
      name:'alpha centauri',
      loadavg:0.5,
      pos:[4,0,0]
    });
  }).then(function(id) {
    body({
      system:id,
      name:'alpha centauri Ab',
      rocky:true,
      r:re*4,
      pos:[au*1.2,0,0]
    });
  });
};
