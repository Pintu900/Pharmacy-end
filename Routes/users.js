const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const secretKey = 'yoursecretkey';


// User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

// User model
const User = mongoose.model('User', UserSchema);

// Register user route
router.post('api/register', async (req, res) => {
  // Check if the required fields are present in the request body
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please enter a username and password' });
  }
  
  // Check if the user already exists
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
  // Create a new user
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword
  });
  
  // Save the user to the database
  await newUser.save();
  
  // Send a success message
  res.status(201).json({ message: 'User registered successfully' });
});


// Middleware function to check for valid token
const checkAuth = (req, res, next) => {
  // Get the token from the headers
//   console.log(req.headers)
  const token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify the token
//   try {
//     const decoded = jwt.verify(token, secretKey);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.log(decoded);
    req.user = decoded;
    next();
  });
};

// Login route
router.post('/api/login', async(req, res) => {
  // Authenticate the user and get the user object
  const user =await authenticateUser(req.body.username, req.body.password);

  // If user is not found
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create a JWT token
  const token = jwt.sign({ id: user._id }, secretKey,{ noTimestamp:true, expiresIn: '1h' });

  // Send the token in the response
  res.json({ token });
});

// Protected route
router.get('/api/profile', checkAuth, async (req, res) => {
    try {
        // Find the user by ID
        console.log(req.user);
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
});

const authenticateUser = async (username, password) => {
    // Find the user by username
    const user = await User.findOne({ username });
  
    // If user is not found
    if (!user) {
      return false;
    }
  
    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
  
    // If passwords do not match
    if (!isMatch) {
      return false;
    }
  
    // Return the user object
    return user;
  };

module.exports = {router,checkAuth};
