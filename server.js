const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// MongoDB Atlas connection
const uri = process.env.MONGODB_URI;

app.get('/', (req, res) => {
  res.send("Hello World!");
})

mongoose
  .connect(uri, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });


// Import authentication routes
const authRoutes = require('./routes/authenticate'); // Updated import

// Import route files
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

// Use the authentication routes
app.use('/auth', authRoutes); // Updated use with "/auth" prefix

// Use the routes for students and teachers
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
