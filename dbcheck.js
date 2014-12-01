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
        t.timestamp('created').defaultTo(knex.raw('now()'));
        t.timestamp('changedpass');
        t.timestamp('lastplayed');
        t.specificType('ip','inet');
      });
    }
  }).then(function() {
    console.log('tables all good.');
  });
};
