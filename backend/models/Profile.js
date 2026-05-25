import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  bio: { type: String, default: "I am a dedicated Data Science student at IIT Patna, bridging the gap between complex machine learning architectures and scalable web applications. My passion lies in developing intelligent systems using the MERN Stack and Deep Learning techniques." },
  education: { type: String, default: "IIT Patna" },
  location: { type: String, default: "Uttar Pradesh, India" },
  stack: { type: String, default: "MERN & Data Science" },
  ageText: { type: String, default: "Sophomore Year" },
  resumeUrl: { type: String, default: "/resume.pdf" },
  heroTagline: { type: String, default: "Deep Learning & Neural Architectures" },
  heroTitle: { type: String, default: "Waheedur Rahman" },
  heroSubtitle: { type: String, default: "Pioneering the next era of Artificial Intelligence and building the intelligent web interface of tomorrow." },
  resumeTitle: { type: String, default: "Curriculum Vitae" },
  resumeDescription: { type: String, default: "Interested in the full spectrum of my research experience and technical background? Download the complete resume below or view it directly in your browser." },
  resumeTags: {
    type: [
      {
        label: { type: String },
        sublabel: { type: String }
      }
    ],
    default: [
      { label: "IIT", sublabel: "Patna" },
      { label: "MERN", sublabel: "Stack" },
      { label: "AI/ML", sublabel: "Expert" },
      { label: "Cyber", sublabel: "Security" }
    ]
  },
  profilePic: { type: String, default: null },
  githubUrl: { type: String, default: 'https://github.com/waheedkhan70' },
  linkedinUrl: { type: String, default: 'https://www.linkedin.com/in/iamwaheedkhan/' },
  contactEmail: { type: String, default: 'waheed066khan@gmail.com' }
}, { timestamps: true });

export const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
