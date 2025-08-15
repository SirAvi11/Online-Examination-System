require('dotenv').config();
const mongoose = require('mongoose');
const { seedUsers } = require('./seedUsers.js');
const { seedModules } = require('./seedModules.js');

const runSeeds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected");

    // 1️⃣ Seed users
    const users = await seedUsers();
    const firstTeacher = users.find(u => u.role === "Teacher");

    // 2️⃣ Seed modules for the first teacher
    const modules = await seedModules(firstTeacher._id);

    console.log("All seed data inserted!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runSeeds();
