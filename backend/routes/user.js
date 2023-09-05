const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const randomstring = require('randomstring');
const router = express.Router();
const client = new OAuth2Client('509113508042-inttactbo73jc3tr4ob8ej8heuasv94c.apps.googleusercontent.com');

const setSameSiteNone = (req, res, next) => {
  res.cookie("SameSite", "None", { sameSite: "none", secure: true });
  next();
};


router.post("/signup/google", setSameSiteNone, async (req, res, next) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "509113508042-inttactbo73jc3tr4ob8ej8heuasv94c.apps.googleusercontent.com",
    });
    const { email } = ticket.getPayload();

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const randomPassword = cryptoRandomString({ length: 10 });
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const user = new User({
      email: email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log("Error signing up with Google:", error);
    res.status(500).json({ error: "Sign-up failed" });
  }
});

router.get('/checkIfUserExists/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userExists = await checkUserExists(userId);

    if (userExists) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function checkUserExists(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return false;
  }

  const user = await User.exists({ _id: userId });
  return user;
}

router.post("/signup", setSameSiteNone, (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created!!!!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
              message: 'Invalid authentication credentials!'
          });
        });
    });
});


router.post("/login", setSameSiteNone, (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed.1."
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication failed.2."
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Authentication failed.3."
      });
    });
});


module.exports = router;
