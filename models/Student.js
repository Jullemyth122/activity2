const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  course: String,
  section: String,
});

module.exports = mongoose.model('Student', studentSchema);
