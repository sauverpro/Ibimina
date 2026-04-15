const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  await db.collection('users').updateOne(
    { email: 'cedric@gmail.com' },
    { $set: { 
      password: '$2a$10$ZnOWARAUseSuqY8OzSMnhOCNno2CdHIxO1yA1/VmQSlhVD3gqok3C', 
      role: 'president' 
    }}
  );
  console.log('User updated!');
  process.exit();
}).catch(err => console.log(err));
