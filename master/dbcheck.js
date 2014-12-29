var Promise=require('bluebird');

//make sure database is set up right
module.exports=function(knex,debug) {
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
  }
  ];

  debug('checking tables...');
  //converts a table definition into a bluebird promise
  function bbtable(o) {
    return knex.schema.hasTable(o.name).then(function(exists) {
      if(exists) return;
      debug('%s does not exist, creating...',o.name);
      //debug(knex.schema.createTable(o.name,o.def).toString());
      return knex.schema.createTable(o.name,o.def);
    });
  }
  tables[0]=bbtable(tables[0]);
  //run each promise sequentially
  return tables.reduce(function(l,r) {
    return l.then(function() {return bbtable(r);});
  })
  .then(function() {
    debug('tables all good.');
  });
};
