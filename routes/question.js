var express = require("express");
var router = express.Router();
var models = require("../models/index");
const helpers = require("../helpers/util")

/* GET users listing. */
router.get("/", helpers.verifyToken, function (req, res, next) {
  models.Question.findAll({})
    .then(function (questions) {
      res.json(questions);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.post("/", function (req, res) {
  models.Question.create({
    title: req.body.title,
    description: req.body.description,
    tag: {},
    vote: {}
  })
    .then(function (question) {
      res.status(201).json({ question });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.delete('/:id', function(req, res) {
  models.Question.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(question) {
    res.json(question);
  });
});

router.get('/:id', helpers.verifyToken, function(req, res) {
  models.Question.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(question) {
    res.json(question);
  });
});



module.exports = router;
