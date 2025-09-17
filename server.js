// Load environment variables
require('dotenv').config({ path: './config/.env' });

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

// Initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Routes

// GET: RETURN ALL USERS
app.get('/users', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();
    // Return users as JSON response
    res.json(users);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});

// POST: ADD A NEW USER TO THE DATABASE
app.post('/users', async (req, res) => {
  try {
    // Create a new user instance with request body data
    const user = new User(req.body);
    // Save the user to the database
    const savedUser = await user.save();
    // Return the saved user as JSON response
    res.status(201).json(savedUser);
  } catch (error) {
    // Handle validation errors or other issues
    res.status(400).json({ message: error.message });
  }
});

// PUT: EDIT A USER BY ID
app.put('/users/:id', async (req, res) => {
  try {
    // Find user by ID and update with request body data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Return updated document and validate update
    );
    
    // If user not found, return 404
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return updated user as JSON response
    res.json(updatedUser);
  } catch (error) {
    // Handle errors
    res.status(400).json({ message: error.message });
  }
});

// DELETE: REMOVE A USER BY ID
app.delete('/users/:id', async (req, res) => {
  try {
    // Find user by ID and delete
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    // If user not found, return 404
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return success message
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});