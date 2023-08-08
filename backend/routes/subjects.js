const express = require("express");
const Subject = require("../models/Subject");
const router = express.Router();

// Get all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the subject already exists
    const existingSubject = await Subject.findOne({ name });
    if (existingSubject) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const newSubject = new Subject({ name });
    await newSubject.save();

    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
