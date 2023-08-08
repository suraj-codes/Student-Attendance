const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: Date,
  class: String,
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subjects: [String],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
