'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Edit2, Trash2, Plus, Save } from 'lucide-react';
import AdminModal from '../ui/AdminModal';
import { apiUrl } from '@/lib/api';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

const CATEGORIES = [
  'AI & Data Science',
  'Web Development (MERN Stack & Frontend)',
  'Programming & Software Engineering',
  'Cybersecurity & Systems'
];

export default function SkillsList() {
  const { data: session } = useSession();
  const isAdmin = !!session;

  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    proficiency: 50
  });

  const fetchSkills = async () => {
    try {
      console.log(`[SkillsList] Fetching from: ${apiUrl('/skills')}`);
      const response = await fetch(apiUrl('/skills'));
      if (!response.ok) {
        throw new Error(`Failed to fetch skills: ${response.status}`);
      }
      const data = await response.json();
      console.log(`[SkillsList] Data received (${data.length} skills):`, data);
      if (data && data.length > 0) {
        setSkills(data);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await fetch(apiUrl(`/skills/${id}`), { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || `Delete failed: ${res.status}`);
      }
      setSkills(skills.filter(s => s._id !== id));
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete skill. Check backend/database connection.");
    }
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({ name: '', category: activeCategory, proficiency: 80 });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, category: skill.category, proficiency: skill.proficiency });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingSkill) {
        // Update
        const res = await fetch(apiUrl(`/skills/${editingSkill._id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(errorData.message || `Update failed: ${res.status}`);
        }
        const updated = await res.json();
        setSkills(skills.map(s => s._id === updated._id ? updated : s));
      } else {
        // Create
        const res = await fetch(apiUrl('/skills'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(errorData.message || `Creation failed: ${res.status}`);
        }
        const created = await res.json();
        setSkills([...skills, created]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Save skill error:", error);
      alert(error.message || "Failed to save skill. Please check backend connection.");
    }
  };

  const filteredSkills = skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 px-4 bg-slate-900/50 relative">
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSkill ? "Edit Skill" : "Add New Skill"}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Skill Name</label>
            <input 
              type="text" value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Category</label>
            <select 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Proficiency Percentage ({formData.proficiency}%)</label>
            <input 
               type="range" min="0" max="100" 
               value={formData.proficiency} 
               onChange={e => setFormData({...formData, proficiency: parseInt(e.target.value)})}
               className="w-full mt-2"
            />
          </div>
          <button 
            onClick={handleSave} 
            className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" /> Save Skill
          </button>
        </div>
      </AdminModal>

      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Technical Prowess</h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full" />
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat || '')}
              className={`px-6 py-2 rounded-full border transition-all ${
                activeCategory === cat 
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
          
          {isAdmin && (
             <button onClick={openAddModal} className="px-5 py-2 ml-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2 font-bold shadow-lg">
                <Plus className="w-4 h-4" /> Add Skill
             </button>
          )}
        </div>

        {/* Skills Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={skill._id}
                className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl hover:border-blue-500/50 transition-colors group relative"
              >
                {isAdmin && (
                  <div className="absolute -top-3 -right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => openEditModal(skill)} className="p-2 bg-blue-500 hover:bg-blue-400 text-white rounded-full shadow-lg">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(skill._id)} className="p-2 bg-red-500 hover:bg-red-400 text-white rounded-full shadow-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-sm text-slate-400">{skill.proficiency}%</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
