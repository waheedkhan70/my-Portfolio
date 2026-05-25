'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, GraduationCap, Code2, BrainCircuit, Edit2, Save, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';
import AdminModal from '../ui/AdminModal';
import { apiUrl } from '@/lib/api';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function AboutSection() {
  const { data: session } = useSession();
  const isAdmin = !!session;

  const [profile, setProfile] = useState({
    bio: "I am a dedicated **Data Science** student at **IIT Patna**, bridge the gap between complex machine learning architectures and scalable web applications. My passion lies in developing intelligent systems using the **MERN Stack** and **Deep Learning** techniques.",
    education: "IIT Patna",
    location: "Uttar Pradesh, India",
    stack: "MERN & Data Science",
    ageText: "Sophomore Year",
    profilePic: null as string | null,
    githubUrl: "",
    linkedinUrl: "",
    contactEmail: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log(`[AboutSection] Fetching from: ${apiUrl('/profile')}`);
    fetch(apiUrl('/profile'))
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText}. ${errorText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log(`[AboutSection] Data received:`, data);
        if (data && data._id) {
          const fetched = {
            ...data,
            profilePic: data.profilePic || null,
            githubUrl: data.githubUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            contactEmail: data.contactEmail || ""
          };
          setProfile(fetched);
          setEditForm(fetched);
        }
      })
      .catch(err => {
        console.error("Profile fetch error:", err);
      });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(apiUrl('/upload'), {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || `Upload failed: ${res.status}`);
      }

      const data = await res.json();
      if (data.url) {
        setEditForm(prev => ({ ...prev, profilePic: data.url }));
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert(err.message || "File upload failed. Please check your backend connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(apiUrl('/profile'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setProfile(data);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Save profile error:", err);
      alert(err.message || "Failed to save profile. Please ensure the backend is running and the database is connected.");
    }
    setIsSaving(false);
  };

  return (
    <section id="about" className="py-24 px-4 bg-slate-950 relative">
      <AdminModal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile Details">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Bio</label>
            <textarea
              value={editForm.bio}
              onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white h-32"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Education</label>
              <input
                type="text" value={editForm.education}
                onChange={e => setEditForm({ ...editForm, education: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Location</label>
              <input
                type="text" value={editForm.location}
                onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Stack</label>
              <input
                type="text" value={editForm.stack}
                onChange={e => setEditForm({ ...editForm, stack: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Age / Status</label>
              <input
                type="text" value={editForm.ageText}
                onChange={e => setEditForm({ ...editForm, ageText: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">LinkedIn URL</label>
              <input
                type="text" value={editForm.linkedinUrl}
                onChange={e => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">GitHub URL</label>
              <input
                type="text" value={editForm.githubUrl}
                onChange={e => setEditForm({ ...editForm, githubUrl: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm text-slate-400 mb-1 block">Contact Email</label>
              <input
                type="text" value={editForm.contactEmail}
                onChange={e => setEditForm({ ...editForm, contactEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Profile Picture</label>
              <div className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-600 bg-slate-800 shrink-0">
                  {editForm.profilePic ? (
                    <img src={editForm.profilePic} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-500" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  {uploading && <p className="text-[10px] text-blue-400 animate-pulse">Uploading...</p>}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || uploading}
            className="w-full py-3 mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </AdminModal>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-600/20 to-emerald-500/20 border border-slate-800 flex items-center justify-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt={profile.education}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <BrainCircuit className="w-48 h-48 text-blue-500/40 group-hover:scale-110 transition-transform duration-500" />
              )}

              <div className="absolute top-8 right-8 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-xl">
                <p className="text-blue-400 font-bold">{profile.ageText}</p>
                <p className="text-xs text-slate-400">@ {profile.education}</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {isAdmin && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -top-10 right-0 lg:-top-4 lg:right-0 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            )}

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">About Me</h2>
            <h3 className="text-2xl text-blue-400 font-medium mb-8">Waheedur Rahman <span className="text-slate-500 text-lg ml-2">(He/Him)</span></h3>

            <p className="text-slate-300 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
              {profile.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <GraduationCap className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Education</p>
                  <p className="font-medium">{profile.education}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <MapPin className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Location</p>
                  <p className="font-medium">{profile.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <Code2 className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Stack</p>
                  <p className="font-medium">{profile.stack}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <User className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Age</p>
                  <p className="font-medium">{profile.ageText}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-6">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                  <LinkedinIcon className="w-5 h-5" /> LinkedIn
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 hover:text-white transition-all">
                  <GithubIcon className="w-5 h-5" /> GitHub
                </a>
              )}
              {profile.contactEmail && (
                <a href={`mailto:${profile.contactEmail}`}
                  // className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all"
                  // title="Send Email">
                  className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-2xl hover:bg-emerald-500 hover:text-white transition-all" title="Send Email">
                  <Mail className="w-5 h-5" /> Gmail
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
