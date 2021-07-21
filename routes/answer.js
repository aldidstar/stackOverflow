var express = require('express');
var router = express.Router();
var models = require('../models/index');



router.get("/:QuestionId", function (req, res, next) {
  models.Answer.findAll({
    where: {
      QuestionId: req.params.QuestionId
    }
  })
    .then(function (answers) {
      res.json(answers);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.post("/", function (req, res) {
  models.Answer.create({
    title: '',
    description: req.body.description,
    tag: {},
    vote: {},
    QuestionId: req.body.QuestionId
  })
    .then(function (answers) {
      res.status(201).json({ answers });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

module.exports = router;
