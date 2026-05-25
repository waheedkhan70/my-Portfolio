import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Skill } from './models/Skill.js';
import connectDB from './config/db.js';

dotenv.config();

const skills = [
  // AI & Data Science
  { name: 'Machine Learning', category: 'AI & Data Science', proficiency: 90 },
  { name: 'Retrieval-Augmented Generation (RAG)', category: 'AI & Data Science', proficiency: 85 },
  { name: 'TensorFlow', category: 'AI & Data Science', proficiency: 80 },
  { name: 'Pandas', category: 'AI & Data Science', proficiency: 95 },
  { name: 'NumPy', category: 'AI & Data Science', proficiency: 95 },
  { name: 'Seaborn', category: 'AI & Data Science', proficiency: 85 },
  { name: 'Matplotlib', category: 'AI & Data Science', proficiency: 85 },
  { name: 'Beautiful Soup', category: 'AI & Data Science', proficiency: 90 },

  // Web Development
  { name: 'MongoDB', category: 'Web Development', proficiency: 90 },
  { name: 'Express.js', category: 'Web Development', proficiency: 90 },
  { name: 'React.js', category: 'Web Development', proficiency: 95 },
  { name: 'Node.js', category: 'Web Development', proficiency: 90 },
  { name: 'Mongoose ODM', category: 'Web Development', proficiency: 90 },
  { name: 'Embedded JavaScript (EJS)', category: 'Web Development', proficiency: 80 },
  { name: 'HTML5 / CSS3', category: 'Web Development', proficiency: 95 },
  { name: 'JavaScript', category: 'Web Development', proficiency: 95 },
  { name: 'Tailwind CSS', category: 'Web Development', proficiency: 90 },
  { name: 'Bootstrap', category: 'Web Development', proficiency: 85 },

  // Programming
  { name: 'Python', category: 'Programming', proficiency: 95 },
  { name: 'Object-Oriented Programming (OOP)', category: 'Programming', proficiency: 90 },
  { name: 'REST APIs', category: 'Programming', proficiency: 90 },
  { name: 'SQL', category: 'Programming', proficiency: 80 },
  { name: 'Git', category: 'Programming', proficiency: 85 },

  // Cybersecurity
  { name: 'Kali Linux', category: 'Cybersecurity', proficiency: 75 },
];

const seedData = async () => {
  try {
    await connectDB();
    await Skill.deleteMany();
    await Skill.insertMany(skills);
    console.log('Skills seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
