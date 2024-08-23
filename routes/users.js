const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const { checkBody } = require("../modules/checkBody");

const User = require("../models/users");

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: uid2(32), // Generate a unique token
        canBookmark: true,
      });

      newUser.save().then((data) => {
        res.json({ result: true, token: data.token });
      });
    } else {
      res.json({ result: false, error: "Username already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data) {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, token: data.token });
      } else {
        res.json({ result: false, error: "Invalid Password" });
      }
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.get("/canBookmark/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      res.json({ result: true, canBookmark: data.canBookmark });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

module.exports = router;
