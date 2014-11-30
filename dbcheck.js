var Promise=require('bluebird');
//make sure database is set up right
module.exports=function(knex) {
  console.log('checking tables...');
  return knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      console.log('users does not exist, creating...');
      return knex.schema.createTable('users', function(t) {
        t.increments('id').primary();
        t.string('name',16);
        t.string('pass',60);
        t.dateTime('created').defaultTo(knex.raw('now()'));
        t.dateTime('changedpass').defaultTo(knex.raw('now()'));
        t.dateTime('lastplayed').defaultTo(knex.raw('now()'));
        t.specificType('ip','inet');
      });
    }
  }).then(function() {
    console.log('tables all good.');
  });
};
