
module.exports=function(knex) {
  return {
    subq:function(q) {
      return knex.raw('('+q+')');
    }
  };
};
