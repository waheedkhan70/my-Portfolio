'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Terminal } from 'lucide-react';
import { apiUrl } from '@/lib/api';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

export default function ManageSkills() {
  const { data: session, status } = useSession();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'AI & Data Science', proficiency: 80 });
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
    fetchSkills();
  }, [status]);

  const fetchSkills = async () => {
    const res = await fetch(apiUrl('/skills'));
    const data = await res.json();
    setSkills(data);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(apiUrl('/skills'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSkill),
    });
    setNewSkill({ name: '', category: 'AI & Data Science', proficiency: 80 });
    fetchSkills();
  };

  const handleDelete = async (id: string) => {
    await fetch(apiUrl(`/skills/${id}`), { method: 'DELETE' });
    fetchSkills();
  };

  if (status === 'loading') return <div className="p-10 text-white">Loading Command Center...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Manage Skills</h1>
          <p className="text-slate-400">Add or remove your technical expertise from the live site.</p>
        </header>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Skill Name</label>
            <input 
              value={newSkill.name}
              onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white" 
              placeholder="e.g. PyTorch"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
            <select 
              value={newSkill.category}
              onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
            >
              <option>AI & Data Science</option>
              <option>Web Development (MERN Stack & Frontend)</option>
              <option>Programming & Software Engineering</option>
              <option>Cybersecurity & Systems</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add Skill
          </button>
        </form>

        {/* Skills List */}
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill._id} className="flex items-center justify-between p-4 bg-slate-900/30 border border-slate-800 rounded-2xl group">
              <div>
                <p className="font-bold">{skill.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{skill.category}</p>
              </div>
              <button 
                onClick={() => handleDelete(skill._id)}
                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                title="Delete Skill"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={() => router.push('/admin')}
          className="mt-12 text-blue-400 hover:underline flex items-center gap-2"
        >
          <Terminal className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}
