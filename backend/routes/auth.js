const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// User login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User Not Found", user });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// User registration
router.post("/register", async (req, res) => {
  const { username, password, name, age, sclass, subjects } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      age,
      class: sclass,
      subjects,
      role: "student",
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// User logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
