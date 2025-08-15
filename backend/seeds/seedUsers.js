const User = require('../models/User.js');

const seedUsers = async () => {
  const users = [
    { name: "T12", email: "teacher1@test.com", passwordHash: "$2b$10$a58.ZOP/28ZukCaHo7Ci3e8rx4VHZVq.nQfgkxNpOUwpYX4lzqHAG", role: "Teacher" },
    { name: "Teacher 2", email: "teacher2@test.com", passwordHash: "$2b$10$a58.ZOP/28ZukCaHo7Ci3e8rx4VHZVq.nQfgkxNpOUwpYX4lzqHAG", role: "Teacher" },
    { name: "Student 1", email: "student1@test.com", passwordHash: "$2b$10$a58.ZOP/28ZukCaHo7Ci3e8rx4VHZVq.nQfgkxNpOUwpYX4lzqHAG", role: "Student" }
  ];

  await User.deleteMany({}); // Remove all existing users
  const insertedUsers = await User.insertMany(users);
  console.log("Users seeded:", insertedUsers.map(u => ({ name: u.name, email: u.email, role: u.role })));
  return insertedUsers;
};

module.exports = { seedUsers };
