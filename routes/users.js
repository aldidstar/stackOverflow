var express = require("express");
var router = express.Router();
var models = require("../models/index");
const secretKey = "aldi";
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get("/", function (req, res) {
  models.User.findAll({})
    .then(function (users) {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.post("/", function (req, res) {
  models.User.create({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  })
    .then(function (user) {
      res.status(201).json({ user });
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});
router.delete("/:id", function (req, res) {
  models.User.destroy({
    where: {
      id: req.params.id,
    },
  }).then(function (users) {
    res.json(users);
  });
});

router.post("/authenticate", function (req, res) {
  // find the user
  models.User.findOne(
    {
      where: {
        email: req.body.email,
      },
    }).then(
    function (user) {
     
        
      if (!user)
        return res.json({
          success: false,
          message: "Authentication failed. User not found.",
        });

      user.validatePassword(req.body.password, function (err, match) {
        if (err || !match)
          return res.json({
            success: false,
            message: "Authentication failed. Wrong password.",
          });
        const payload = {
          admin: user.admin,
        };
        var token = jwt.sign(
          {
            name: user.name,
          },
          secretKey,
          { expiresIn: 60 * 60 }
        );

        // return the information including token as JSON
        res.json({
          success: true,
          message: "Enjoy your token!",
          token: token,
        });
      });
    }
  ).catch((err) => {
    return res.json({
      success: false,
      message: "Authentication failed.",
    });

  })
});

module.exports = router;
