var config=require('../config.js'),
  _=require('lodash'),
  Promise=require('bluebird'),
  tools=require('../shared/knexutils.js'),
  utils=require('../shared/utils.js');

function foldpromise(fn,o) {
  var keys=_.keys(o);
  return keys.reduce(function(l,r) {
    return l.then(fn.bind(null,r,o[r]));
  },Promise.resolve());
}

module.exports=function(debug,knex,data) {
  data=utils.oclone(data);
  tools=tools(knex);
  debug('running build script...');

  function makebp(bps) {
    function bp(name,o) {
      return tools.idins('blueprints',{
        name:name,
        station:o.station||false,
        armor:o.armor,
        shield:o.shield
      });
    }
    return foldpromise(bp,bps);
  }
  function makesystems(systems) {
    //top level, gets called for each system. inserts data, then calls place
    //on all of system.places, which has planets, stations, etc.
    function system(name,o) {
      return tools.idins('systems',{
        name:name,
        loadavg:o.loadavg,
        x:o.pos[0],y:o.pos[1],z:o.pos[2]
      }).then(function(systemid) {
        return foldpromise(place(systemid),o.places);
      });
    }
    //takes systemid as an argument to pass it in to the fold function
    function place(systemid) {
      systemid=systemid[0];
      //this is the actual function, given a name because it's recursive
      return function rec(name,o) {
        var isbody='r' in o,
          isstation='blueprint' in o;
        
        var p=Promise.resolve();
        //add rows to specific tables based on type
        if(isbody) {
          p=p.then(function() {
            return tools.idins('bodies',{
              r:o.r,
              rocky:o.rocky
            });
          });
          o.orbiting=true;
        } else if(isstation) {
          p=p.then(function() {
            return tools.idins('entities',{
              systemid:systemid,
              name:name,
              blueprintid:tools.subq(knex('blueprints').select('id').where('name',o.blueprint)),
              x:o.pos[0],y:o.pos[1],z:o.pos[2]
            })
          });
        }
        //now add the place; this contains extra logic based on its type
        p=p.then(function(id) {
          id=id[0];//id is either an id of the body or the station ent
          var columns={
            systemid:systemid,
            name:name,
            orbiting:o.orbiting||isstation||false,
            x:o.pos[0],y:o.pos[1],z:o.pos[2]
          };
          if(isbody) columns.bodyid=id;
          else if(isstation) columns.entityid=id;
          if(o.parent) columns.parentid=o.parent[0];
          return knex('places').returning('id').insert(columns);
        });
        //now do the same recursively onto the children
        return p.then(function(parent) {
          return foldpromise(function(name,o) {
            o.parentid=parent;
            return rec(name,o,parent);
          },o.places);
        });
      };
    }
    return foldpromise(system,systems);
  }
  return makebp(data.blueprints).then(function() {
    return makesystems(data.systems);
  });
};
