var _=require('lodash');

//make sure database is set up right
module.exports=function(debug,knex) {
  function primary(t) {
    t.increments('id').primary();
  }
  function pos(t) {
    t.double('x');
    t.double('y');
    t.double('z');
  }
  function foreign(t,table) {
    t.integer(table.substr(0,table.length-1)+'id')
    .unsigned().references('id').inTable(table);
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
      //added after
      //foreign(t,'ships');
    }
  },{
    name:'owners',
    def:function(t) {
      primary(t);
      foreign(t,'users');
    }
  },{
    name:'systems',
    def:function(t) {
      primary(t);
      t.string('name',30);
      t.double('loadavg');
      //ly from origin
      pos(t);
    }
  },{
    name:'places',
    def:function(t) {
      primary(t);
      foreign(t,'systems');
      t.string('name',30);
      //m from sun
      pos(t);
    }
  },{
    name:'blueprints',
    def:function(t) {
      primary(t);
      t.integer('name',30);
      t.boolean('station');
      t.double('armor');
    }
  },{
    name:'stations',
    def:function(t) {
      primary(t);
      foreign(t,'places');
      foreign(t,'blueprints');
    }
  },{
    name:'ships',
    def:function(t) {
      primary(t);
      foreign(t,'owners');
      foreign(t,'stations');
      //m from sun
      pos(t);
    }
  },
  //what a mess! this has to reference ships, so it goes after...
  {
    name:'users',
    def:function(t) {
      foreign(t,'ships');
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
    return _.isEmpty(created);
  });
};
