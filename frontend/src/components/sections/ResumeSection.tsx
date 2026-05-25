'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, ExternalLink, Edit2, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import AdminModal from '../ui/AdminModal';
import { apiUrl } from '@/lib/api';

export default function ResumeSection() {
  const { data: session } = useSession();
  const isAdmin = !!session;

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    resumeUrl: '/resume.pdf',
    resumeTitle: 'Curriculum Vitae',
    resumeDescription: 'Interested in the full spectrum of my research experience and technical background? Download the complete resume below or view it directly in your browser.',
    resumeTags: [
      { label: 'IIT', sublabel: 'Patna' },
      { label: 'MERN', sublabel: 'Stack' },
      { label: 'AI/ML', sublabel: 'Expert' },
      { label: 'Cyber', sublabel: 'Security' }
    ]
  });

  // Form state for modal
  const [formData, setFormData] = useState({ ...profileData });

  useEffect(() => {
    fetch(apiUrl('/profile'))
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch resume data: ${res.status} ${res.statusText}. ${errorText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          const fetched = {
            resumeUrl: data.resumeUrl || '/resume.pdf',
            resumeTitle: data.resumeTitle || 'Curriculum Vitae',
            resumeDescription: data.resumeDescription || 'Interested in the full spectrum of my research experience...',
            resumeTags: data.resumeTags || [
              { label: 'IIT', sublabel: 'Patna' },
              { label: 'MERN', sublabel: 'Stack' },
              { label: 'AI/ML', sublabel: 'Expert' },
              { label: 'Cyber', sublabel: 'Security' }
            ]
          };
          setProfileData(fetched);
          setFormData(fetched);
        }
      })
      .catch(err => console.error("Could not fetch profile", err));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch(apiUrl('/upload'), {
        method: 'POST',
        body: formDataUpload,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || `Upload failed: ${res.status}`);
      }

      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, resumeUrl: data.url }));
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert(err.message || "File upload failed. Please check your backend connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(apiUrl('/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || `Save failed: ${res.status}`);
      }

      const data = await res.json();
      setProfileData(data);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Save resume error:", err);
      alert(err.message || "Failed to update resume section. Please check backend connection.");
    }
  };

  const handleTagChange = (index: number, field: 'label' | 'sublabel', value: string) => {
    const newTags = [...formData.resumeTags];
    newTags[index] = { ...newTags[index], [field]: value };
    setFormData({ ...formData, resumeTags: newTags });
  };

  return (
    <section id="resume" className="py-24 px-4 bg-slate-950">
      <AdminModal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Resume Section">
        <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto px-1">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Section Title</label>
            <input 
              type="text" value={formData.resumeTitle} 
              onChange={e => setFormData({...formData, resumeTitle: e.target.value})} 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Description</label>
            <textarea 
              value={formData.resumeDescription} 
              onChange={e => setFormData({...formData, resumeDescription: e.target.value})} 
              className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>
          
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Resume File (PDF)</label>
            <div className="flex flex-col gap-2 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileUpload}
                className="text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              {uploading && <p className="text-xs text-blue-400 animate-pulse">Uploading PDF...</p>}
              <div className="flex items-center gap-2 text-xs text-slate-500 break-all">
                <span className="font-bold shrink-0">Current:</span> 
                {formData.resumeUrl}
              </div>
            </div>
          </div>

          <div>
             <label className="text-sm text-slate-400 mb-2 block">Resume Tags (Max 4)</label>
             <div className="grid grid-cols-2 gap-3">
                {formData.resumeTags.map((tag, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col gap-2">
                    <input 
                       className="bg-transparent border-b border-slate-700 text-white text-sm focus:border-blue-500 outline-none" 
                       placeholder="Label (e.g. IIT)"
                       value={tag.label}
                       onChange={e => handleTagChange(idx, 'label', e.target.value)}
                    />
                    <input 
                       className="bg-transparent text-slate-400 text-xs focus:text-blue-400 outline-none" 
                       placeholder="Sublabel (e.g. Patna)"
                       value={tag.sublabel}
                       onChange={e => handleTagChange(idx, 'sublabel', e.target.value)}
                    />
                  </div>
                ))}
             </div>
          </div>

          <button 
            onClick={handleSave} 
            className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Save className="w-5 h-5" /> Save Changes
          </button>
        </div>
      </AdminModal>

      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-8 md:p-16 relative overflow-hidden group shadow-2xl"
        >
          {isAdmin && (
            <div className="absolute top-8 right-8 z-20">
              <button onClick={() => { setFormData({...profileData}); setIsEditing(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95">
                <Edit2 className="w-4 h-4" /> Edit Resume Section
              </button>
            </div>
          )}

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-colors duration-700" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30 mb-8 mt-2">
              <FileText className="w-10 h-10 text-blue-500" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{profileData.resumeTitle}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
              {profileData.resumeDescription}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href={profileData.resumeUrl} 
                download
                className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
              
              <a 
                href={profileData.resumeUrl} 
                target="_blank"
                className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 hover:scale-105 active:scale-95"
              >
                <Eye className="w-5 h-5" />
                View Online
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
               {profileData.resumeTags.map((tag, idx) => (
                 <div key={idx} className="flex flex-col items-center">
                   <p className="text-2xl font-black text-white">{tag.label}</p>
                   <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-blue-400">{tag.sublabel}</p>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
