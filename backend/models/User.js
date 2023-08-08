const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  name: String,
  age: String,
  class: String,
  subjects: Array,
});

module.exports = mongoose.model("User", userSchema);
