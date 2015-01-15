var _=require('lodash'),
  tools=require('../shared/knexutils.js');

//make sure database is set up right
module.exports=function(debug,knex) {
  tools=tools(knex);

  function primary(t) {
    t.increments('id').primary();
  }
  function foreign(t,table,id) {
    t.integer(id||table.substr(0,table.length-1)+'id')
    .unsigned().references('id').inTable(table);
  }
  function pos(t) {
    t.double('x');
    t.double('y');
    t.double('z');
  }
  var tables=[
  {
    name:'users',
    def:function(t) {
      primary(t);
      t.string('name',16);
      t.string('pass',60);
      t.timestamp('created').defaultTo(knex.raw('now()'));
      t.timestamp('changedpass');
      t.timestamp('lastplayed');
      t.specificType('ip','inet');
      t.specificType('lastip','inet');
      //added after
      //foreign(t,'ents');
      //character coordinates
      //t.double('cx');
      //t.double('cy');
      //t.double('cz');
    }
  },{
    name:'systems',
    def:function(t) {
      primary(t);
      t.string('name');
      t.double('loadavg');
      //ly from origin
      pos(t);
    }
  },{
    name:'bodies',
    def:function(t) {
      primary(t);
      t.double('r');//earth radiuses
      t.boolean('rocky');
    }
  },{
    name:'blueprints',
    def:function(t) {
      primary(t);
      t.string('name');
      t.boolean('station');
      t.double('armor');
      t.double('shield');
    }
  },{
    name:'ents',
    def:function(t) {
      primary(t);
      foreign(t,'systems');
      t.string('name',30);
      foreign(t,'blueprints');
      foreign(t,'users');

      foreign(t,'ents','parent');
      //m from sun or whatever
      pos(t);
    }
  },{
    name:'places',
    def:function(t) {
      primary(t);
      foreign(t,'systems');
      t.string('name');
      foreign(t,'places','parentid')
      t.boolean('orbiting');
      //m from parent
      pos(t);
      foreign(t,'bodies','bodyid');
      foreign(t,'ents');
    }
  },
  //what a mess! this has to reference ents, so it goes after...
  {
    name:'users',
    def:function(t) {
      foreign(t,'ents');
      //character coordinates
      t.double('cx');
      t.double('cy');
      t.double('cz');
    }
  }
  ];

  debug('checking tables...');
  //tables created so far
  var created={};
  //converts a table definition into a bluebird promise
  function bbtable(o) {
    return knex.schema.hasTable(o.name).then(function(exists) {
      //we do this silly thing with cmd because if we are adding to the
      //table, the knex command is different
      var cmd;
      if(exists) {
        if(created[o.name]) {//only add if the table is new
          debug('adding to %s...',o.name);
          cmd='table';
        }
        else return;
      } else {
        debug('%s does not exist, creating...',o.name);
        cmd='createTable';
      }
      created[o.name]=true;
      //debug(knex.schema[cmd](o.name,o.def).toString());
      return knex.schema[cmd](o.name,o.def);
    });
  }
  //start with a base promise
  tables[0]=bbtable(tables[0]);
  //run each promise sequentially
  return tables.reduce(function(l,r) {
    return l.then(function() {return bbtable(r);});
  })
  .then(function() {
    debug('tables all good.');
    return !_.isEmpty(created);
  });
};
