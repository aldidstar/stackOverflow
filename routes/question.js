var express = require("express");
var router = express.Router();
var models = require("../models/index");
const helpers = require("../helpers/util");
var jwt = require("jsonwebtoken");



/* GET users listing. */
router.get("/", helpers.verifyToken, function (req, res, next) {
  models.Question.findAll({
    
    order: [
      ['id', 'DESC']
    ],
    include: [models.Answer],
  })
    .then(function (questions) {
      res.json(questions);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.get("/search/question", helpers.verifyToken, function (req, res, next) {
  models.Question.findOne({
    // include    : [models.Answer],
    where: {
      title: req.query.title 
      // {
        // [Sequelize.Op.iLike]: `%${req.query.title}%`
      // } 
      
    },
    include: [models.Answer],
  })
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
    tag: req.body.tag,
    vote: { count: 0, voter: [] },
  })
    .then(function (question) {
      res.status(201).json({ question });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.delete("/:id", function (req, res) {
  models.Question.destroy({
    where: {
      id: req.params.id,
    },
  }).then(function (question) {
    res.json(question);
  });
});

router.get("/:id", helpers.verifyToken, function (req, res) {
  models.Question.findOne({
    where: {
      id: req.params.id,
    },
    include: [models.Answer],
  }).then(function (question) {
    res.json(question);
  });
});

router.put("/vote", helpers.verifyToken, function (req, res) {
  const { id, name } = jwt.decode(req.headers["x-access-token"]);
  
  models.Question.findOne({
    where: {
      id: req.body.idQuestion,
    },
   
    
  }).then((question) => {
    if (req.body.mode == 'up') {
      if (question.vote.voter.filter((item) => item.id == id).length == 0) {
        question.vote = {
          count: question.vote.count + 1,

          voter: [...question.vote.voter, { id, name }],
        };
        console.log(question);
        question.save();
        res.json({
          success: true,
        });
      } 
      else {
        res.json({
          success: false,
          message: "anda sudah vote",
        });
      }
    }
    else if (req.body.mode == 'down')  {
      if (question.vote.voter.filter((item) => item.id == id).length == 0) {
        question.vote = {
          count: question.vote.count - 1,

          voter: [...question.vote.voter, { id, name }],
        };
        console.log(question);
        question.save();
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
        res.json({
          success: false,
          message: "gagal vote",
        });
      }
  });
});


module.exports = router;

