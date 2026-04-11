const mongoose = require('mongoose');
const User = require('./backend/models/User');
const Task = require('./backend/models/Task');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const user = await User.findOne({});
    if (!user) {
      console.log('No user found in DB');
      process.exit();
    }
    console.log('Testing with User:', user.email);
    
    // Generate valid token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    console.log('Generated valid token.');

    // Attempt to add a task with the controller logic
    const req = {
      user: user,
      body: {
        title: 'Script Task',
        description: 'Auto',
        status: 'todo',
        priority: 'low'
      }
    };
    
    const res = {
      status: (code) => ({
        json: (data) => console.log('Response:', code, data)
      })
    };
    const next = (err) => console.error('Next called with error:', err);

    // Call createTask directly or via API test snippet! We'll just call the API directly using fetch since backend is running
    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(req.body)
    });
    console.log('API HTTP status:', response.status);
    console.log('API string response:', await response.text());
    
    process.exit();
  })
  .catch(console.error);
