import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'AI & Data Science', 
      'Web Development (MERN Stack & Frontend)', 
      'Programming & Software Engineering', 
      'Cybersecurity & Systems'
    ], 
    required: true 
  },
  icon: { type: String }, 
  proficiency: { type: Number, min: 0, max: 100 },
}, { timestamps: true });

export const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
