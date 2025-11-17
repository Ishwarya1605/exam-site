const StudentUser = require("../models/studentUser");


const registerStudent = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await StudentUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const student = new StudentUser({
      username,
      email,
      password: hashedPassword
    });

    await student.save();

    res.status(201).json({ message: "Student registered successfully", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getStudents = async (req, res) => {
  try {
    const students = await StudentUser.find().select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerStudent, getStudents };


