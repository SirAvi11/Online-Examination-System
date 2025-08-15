const Module = require('../models/Module.js');

const seedModules = async (teacherId) => {
  const modules = [
    { name: "Mathematics", description: "Algebra & Calculus", questionCount: 25, color: "#ff0000", teacherId },
    { name: "Physics", description: "Mechanics & Thermodynamics", questionCount: 18, color: "#0000ff", teacherId },
    { name: "Chemistry", description: "Organic & Inorganic basics", questionCount: 20, color: "#00ff00", teacherId }
  ];

  await Module.deleteMany({ teacherId }); // Remove previous modules for this teacher
  const insertedModules = await Module.insertMany(modules);
  console.log("Modules seeded:", insertedModules.map(m => ({ name: m.name, teacherId: m.teacherId })));
  return insertedModules;
};

module.exports = { seedModules };
