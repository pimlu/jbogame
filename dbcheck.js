var Promise=require('bluebird');
//make sure database is set up right
module.exports=function(knex,debug) {
  debug('checking tables...');
  return knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      debug('users does not exist, creating...');
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
    debug('tables all good.');
  });
};
