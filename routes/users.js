var express = require('express');
var router = express.Router();
var models = require('../models/index');
const bcrypt = require("bcrypt");
const saltRounds = 10;



/* GET users listing. */
router.get('/', function(req, res) {
  
  models.User.findAll({}).then(function(users) {
    res.json(users);
  }).catch(err => {
    res.status(500).json({err})
  })
});

router.post('/', function(req, res) {
  bcrypt.hash(`${req.body.password}`, saltRounds, function(err, hash) {
    models.User.create({
      email: req.body.email, password: `${hash}`, name: req.body.name
    }).then(function(user) {
      res.status(201).json({user})
    }).catch(err => {
      res.status(500).json({err})
    })
  });
});
 

module.exports = router;
