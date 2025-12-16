const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const devUser = {
  username: "devuser",
  email: "dev@memento.com",
  password: "devpass123",
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: devUser.email });
    if (existing) {
      console.log("Dev user already exists");
    } else {
      const hashed = await bcrypt.hash(devUser.password, 10);
      await User.create({ ...devUser, password: hashed });
      console.log("Dev user created:", devUser.email);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
