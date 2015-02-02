var
  config = require('../config.js'),
  tools = require('../shared/knexutils.js'),
  Promise = require('bluebird'),
  bcrypt = require('bcrypt'),
  hashp = Promise.promisify(bcrypt.hash);
var validateuser = require('./shared/validuser.js');
module.exports = function(knex) {
  tools = tools(knex);
  var system, station, fighter;
  //get static IDs for important things given to every user
  return knex('places').select('systemid', 'entid').where('name', 'alpha station')
    .then(function(row) {
      system = row[0].systemid;
      station = row[0].entid;
    }).then(function(row) {
      return knex('blueprints').select('id').where('name', 'fighter');
    }).then(function(row) {
      fighter = row[0].id;
    }).then(function() {
      return register;
    });

  function register(req, res) {
    var body = req.body;
    var feedback = validateuser(body.name, body.pass, body.pass2);
    //if it's trivially bad, reply back
    if (!feedback[0]) {
      res.send(feedback);
      return;
    }
    //check if name already exists
    knex('users').select(1).limit(1).where('name', body.name).then(function(row) {
      if (row.length === 1) {
        feedback = [false, 'user already exists'];
        return;
      }
      //if it doesn't, hash and insert
      return hashp(body.pass, config.front.rounds).then(function(hash) {
        return knex('users').returning('id').insert({
          name: body.name,
          pass: hash,
          ip: req.ip,
          cx: 0,
          cy: 0,
          cz: 0
        });
      }).then(function(userid) {
        //give them their brand new fighter based on the id

        //TEMPORARILY replaced with station so that I can test player networking
        /*return knex('ents').returning('id').insert({
          systemid:system,
          name:'default fighter name',
          blueprintid:tools.subq(knex('blueprints').select('id').where('name','fighter')),
          userid:userid[0],
          timer:0,
          x:0,y:0,z:0,
          parent:station
        }).then(function(entid) {*/
        //now that the fighter exists, make users point to it
        return knex('users').update({
          entid: station /*entid[0]*/
        }).where('id', userid[0]);
        //});
      });
    }).then(function() {
      res.send(feedback);
    });
  };
};