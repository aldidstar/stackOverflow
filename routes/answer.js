var express = require("express");
var router = express.Router();
var models = require("../models/index");
const helpers = require("../helpers/util");
// const { json } = require('sequelize/types');
var jwt = require("jsonwebtoken");

router.get("/:QuestionId", helpers.verifyToken, function (req, res, next) {
  models.Answer.findAll({
    where: {
      QuestionId: req.params.QuestionId,
    },
  })
    .then(function (answer) {
      res.json(answer);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.post("/", function (req, res) {
  models.Answer.create({
    title: "",
    description: req.body.description,
    tag: {},
    vote: { count: 0, voter: [] },
    QuestionId: req.body.QuestionId,
  })
    .then(function (answers) {
      res.status(201).json({ answers });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.delete("/:id", function (req, res) {
  models.Answer.destroy({
    where: {
      id: req.params.id,
    },
  }).then(function (answer) {
    res.json(answer);
  });
});

router.put("/vote", helpers.verifyToken, function (req, res) {
  const { id, name } = jwt.decode(req.headers["x-access-token"]);
  console.log(req.body.isUp)
  models.Answer.findOne({
    where: {
      id: req.body.idAnswer,
    },
  }).then((answer) => {
    if (req.body.isUp == true) {
      if (answer.vote.voter.filter((item) => item.id == id).length == 0) {
        answer.vote = {
          count: answer.vote.count + 1,

          voter: [...answer.vote.voter, { id, name }],
        };
        console.log(answer);
        answer.save();
        res.json({
          success: true,
        });
      } else {
        res.json({
          success: false,
          message: "anda sudah vote",
        });
      }
    }
    else {
      if (answer.vote.voter.filter((item) => item.id == id).length == 0) {
        answer.vote = {
          count: answer.vote.count --,

          voter: [...answer.vote.voter, { id, name }],
        };
        console.log(answer);
        answer.save();
        res.json({
          success: true,
        });
      } else {
        res.json({
          success: false,
          message: "anda sudah vote",
        });
      }
    }
  });
});

module.exports = router;
