var Promise=require('bluebird');

//make sure database is set up right
module.exports=function(knex,debug) {
  var tables=[
  {
    name:'users',
    def:function(t) {
      t.increments('id').primary();
      t.string('name',16);
      t.string('pass',60);
      t.timestamp('created').defaultTo(knex.raw('now()'));
      t.timestamp('changedpass');
      t.timestamp('lastplayed');
      t.specificType('ip','inet');
    }
  },
  {
    name:'systems',
    def:function(t) {
      t.increments('id').primary();
      t.string('name',30);
      //ly from origin
      t.float('x');
      t.float('y');
      t.float('z');
    }
  },
  {
    name:'places',
    def:function(t) {
      t.increments('id').primary();
      t.integer('systemid').unsigned().references('id').inTable('systems');
      t.string('name',30);
      //m from sun
      t.float('x');
      t.float('y');
      t.float('z');
    }
  },
  {
    name:'stations',
    def:function(t) {
      t.increments('id').primary();
      t.integer('placeid').unsigned().references('id').inTable('places');
      t.string('type',30);
    }
  },
  {
    name:'ships',
    def:function(t) {
      t.increments('id').primary();
      t.integer('userid').unsigned().references('id').inTable('users');
      t.integer('stationid').unsigned().references('id').inTable('stations');
      //m from sun
      t.float('x');
      t.float('y');
      t.float('z');
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
