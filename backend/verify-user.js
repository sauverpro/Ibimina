const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({email: 'cedric@gmail.com'});
  console.log('User:', user);
  const match = await bcrypt.compare('kwetu', user.password);
  console.log('Password matches:', match);
  process.exit();
}).catch(err => console.log(err));