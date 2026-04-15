const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  await db.collection('users').updateOne(
    { email: 'cedric@gmail.com' },
    { $set: { role: 'admin' }}
  );
  console.log('Role updated to admin!');
  process.exit();
}).catch(err => console.log(err));
