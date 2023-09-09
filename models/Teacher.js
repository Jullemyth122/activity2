const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  subjectsHandled: [String],
  department: String,
});

module.exports = mongoose.model('Teacher', teacherSchema);
