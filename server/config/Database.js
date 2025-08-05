// db.js
const mongoose = require('mongoose');
require('dotenv').config()

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB Connected using Mongoose");
  } catch (err) {
    console.error("❌ Connection Error:", err);
  }
}

module.exports = connectDB;
