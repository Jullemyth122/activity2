const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  resetToken: String, // Add resetToken field
  resetTokenExpiration: Date, // Add resetTokenExpiration field
});

module.exports = mongoose.model('User', userSchema);
