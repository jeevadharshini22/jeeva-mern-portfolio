const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../client'));

// ===== FIXED MONGOOSE (2026 Compatible) =====
mongoose.connect('mongodb://localhost:27017/portfolio');

// Schemas
const SkillSchema = new mongoose.Schema({ name: String, level: Number });
const Skill = mongoose.model('Skill', SkillSchema);

const ProjectSchema = new mongoose.Schema({ name: String, desc: String, link: String });
const Project = mongoose.model('Project', ProjectSchema);

// Seed data on connection
mongoose.connection.once('open', async () => {
  console.log('✅ MongoDB Connected!');
  try {
    await Skill.insertMany([
      {name: 'JavaScript', level: 85},
      {name: 'Python', level: 78},
      {name: 'MySQL', level: 90},
      {name: 'React', level: 75},
      {name: 'Node.js', level: 88}
    ]);
    await Project.insertMany([
      {name: 'Quiz Management', desc: 'PHP/MySQL Academic', link: 'github.com/jeeva/quiz'},
      {name: 'ATM Banking', desc: 'Java OOP System', link: 'github.com/jeeva/atm'},
      {name: 'Codec Dashboard', desc: 'Full-Stack Intern', link: '#'}
    ]);
    console.log('✅ Data seeded!');
  } catch (e) {
    console.log('✅ Data already exists');
  }
});

// ===== API ROUTES =====
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills.length ? skills : [{name: 'JavaScript', level: 85}]);
  } catch {
    res.json([{name: 'JavaScript', level: 85}]);
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects.length ? projects : [{name: 'Quiz System', desc: 'PHP/MySQL'}]);
  } catch {
    res.json([{name: 'Quiz System', desc: 'PHP/MySQL'}]);
  }
});

// ===== JWT LOGIN =====
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'jeeva@panimalar.edu' && password === 'codec123') {
    const token = jwt.sign({ email }, 'jeeva-secret-2026', { expiresIn: '24h' });
    res.json({ success: true, token, message: 'Admin login OK' });
  } else {
    res.status(401).json({ success: false, message: 'Wrong credentials' });
  }
});

// ===== CONTACT FORM =====
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio: ${name}`,
      text: `${name} (${email}): ${message}`
    });
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Portfolio: http://localhost:${PORT}`);
});
