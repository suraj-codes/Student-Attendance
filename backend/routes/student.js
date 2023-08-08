const express = require("express");
const Student = require("../models/Student");
const User = require("../models/User");
const router = express.Router();

// Create a new student
router.post("/", async (req, res) => {
  const { name, age, class: studentClass, subjects } = req.body;
  try {
    const newStudent = new Student({
      name,
      age,
      class: studentClass,
      subjects,
    });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
