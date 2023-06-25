const express = require("express");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/users/signup", async (req, res) => {
  // signup new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    return res.status(400).send({ error: "Failed to register you!" });
  }
});

router.post("/users/login", async (req, res) => {
  //Login registered user
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).send({
        error: "Login failed! Check your authentication credentials!",
      });
    }
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (error) {
    return res.status(400).send({ error: "an error occured!" });
  }
});

router.get("/users/profile", auth, async (req, res) => {
  // View logged in user profile
  return res.send(req.user);
});

router.post("/users/me/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    return res.send({ message: "you logged out from your device successfuly" });
  } catch (error) {
    return res.status(500).send({ error: "an error occured!" });
  }
});

router.post("/users/me/logoutall", auth, async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    return res.send({
      message: "you logged out from your all devices successfuly",
    });
  } catch (error) {
    return res.status(500).send({ error: "an error occured!" });
  }
});
module.exports = router;
