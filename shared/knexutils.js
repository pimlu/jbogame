module.exports = function(knex) {
  return {
    subq: function(q) {
      return knex.raw('(' + q + ')');
    },
    idins: function(name, o) {
      return knex(name).returning('id').insert(o);
    }
  };
};