const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const router = express.Router();

// User Registration
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    // Generate a JWT token
    const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error authenticating user' });
  }
});

// Forgot Password - Generate and return a reset token
router.post('/forgot-password', async (req, res) => {
    try {
        const { username } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token (can be a random string)
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Save the reset token and its expiration time in the user's document
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration

        // Save the user document with the reset token
        await user.save();

        res.status(200).json({ resetToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating reset token' });
    }
});

// Reset Password - Use the reset token to reset the password
router.post('/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Find the user by the reset token
        const user = await User.findOne({ resetToken });

        // Check if the reset token is valid and hasn't expired
        if (!user || user.resetTokenExpiration < Date.now()) {
            return res.status(401).json({ message: 'Invalid or expired reset token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and remove the reset token
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        
        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

module.exports = router;
