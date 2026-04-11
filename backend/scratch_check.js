const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const users = await User.find({});
    console.log('Users in DB:', users.length);
    if(users.length > 0) {
       console.log('First user:', users[0].email);
    }
    process.exit();
  })
  .catch(console.error);
