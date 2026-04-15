const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  
  // Delete existing user
  await db.collection('users').deleteOne({ email: 'cedric@gmail.com' });
  console.log('Old user deleted!');
  
  // Hash password fresh
  const hashed = await bcrypt.hash('kwetu', 10);
  console.log('New hash:', hashed);
  
  // Insert fresh user
  await db.collection('users').insertOne({
    name: 'Cedric',
    email: 'cedric@gmail.com',
    password: hashed,
    role: 'president',
    isActive: true,
    balance: 0,
    totalContributed: 0,
    createdAt: new Date()
  });
  console.log('New user inserted!');
  process.exit();
}).catch(err => console.log(err));