const express = require("express");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const User = require("../models/User");
const router = express.Router();

// Mark attendance
router.post("/", async (req, res) => {
  const { date, studentId, subjects } = req.body;
  try {
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const newAttendance = new Attendance({
      date,
      student: studentId,
      subjects,
    });
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/update", async (req, res) => {
  const { attendanceId, subjects } = req.body;
  console.log(attendanceId, subjects);
  try {
    // const response = await Attendance.updateOne(
    //     { id: attendanceId },
    //     { $set: subjects }
    //   );
    const response = await Attendance.updateOne(
      { _id: attendanceId },
      { $set: { subjects } }
    );
    console.log(response);
    res.status(200).json({ message: "Attendance Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Get attendance records for a specific student
router.post("/:studentId", async (req, res) => {
  const { date } = req.body;
  const { studentId } = req.params;
  const selectedDate = new Date(date);

  // Calculate the start and end of the selected date
  const startOfDay = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  const endOfDay = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    23,
    59,
    59
  );

  try {
    const attendance = await Attendance.find({
      student: studentId,
      date: { $gte: startOfDay, $lt: endOfDay },
    }).populate("student");
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/", async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("student");
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
