const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");
const attendanceRoutes = require("./routes/attendance");
const subjectRoutes = require("./routes/subjects");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://surajcodes:Suraj123@cluster0.ojyoqnf.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to Mongo");
  })
  .catch((e) => {
    console.log("Error while connecting to Mongo");
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());
app.options("*", cors());

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/subjects", subjectRoutes);

app.get("/", (req, res) => {
  res.send("Hiiiii");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
