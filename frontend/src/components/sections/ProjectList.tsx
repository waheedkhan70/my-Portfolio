'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import AdminModal from '../ui/AdminModal';
import { apiUrl } from '@/lib/api';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export default function ProjectList() {
  const { data: session } = useSession();
  const isAdmin = !!session;

  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    techString: '',
    githubUrl: '',
    liveUrl: '',
    featured: false
  });

  const fetchProjects = async () => {
    try {
      const response = await fetch(apiUrl('/projects'));
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
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
        throw new Error(errorData.message || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, image: data.url }));
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert(err.message || "File upload failed. Please check your backend connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(apiUrl(`/projects/${id}`), { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || `Delete failed: ${res.status}`);
      }
      setProjects(projects.filter(p => p._id !== id));
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete project. Please check if the backend is running.");
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', image: '', techString: '', githubUrl: '', liveUrl: '', featured: false });
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || '',
      techString: project.technologies.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      technologies: formData.techString.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingProject) {
        const res = await fetch(apiUrl(`/projects/${editingProject._id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(errorData.message || `Update failed: ${res.status}`);
        }
        const updated = await res.json();
        setProjects(projects.map(p => p._id === updated._id ? updated : p));
      } else {
        const res = await fetch(apiUrl('/projects'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(errorData.message || `Creation failed: ${res.status}`);
        }
        const created = await res.json();
        setProjects([...projects, created]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Save project error:", error);
      alert(error.message || "Failed to save project. Please check if the backend is running and connected to the database.");
    }
  };

  return (
    <section id="projects" className="py-24 px-4 bg-slate-950 relative">
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? "Edit Project" : "Add New Project"}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Project Title (Required)</label>
            <input
              type="text" value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Description (Required)</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Project Image</label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              {uploading && <p className="text-xs text-blue-400 animate-pulse">Uploading Image...</p>}
              {formData.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-700 mt-2">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="text"
                placeholder="Or paste image URL"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Technologies (Comma separated)</label>
            <input
              type="text" value={formData.techString}
              onChange={e => setFormData({ ...formData, techString: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">GitHub Link</label>
              <input
                type="text" value={formData.githubUrl}
                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Visit Site Link</label>
              <input
                type="text" value={formData.liveUrl}
                onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox" checked={formData.featured}
              onChange={e => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 accent-emerald-500"
            />
            <span className="text-white">Featured Project</span>
          </label>
          <button
            onClick={handleSave}
            disabled={!formData.title || !formData.description || !formData.image}
            className="w-full py-3 mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> Save Project
          </button>
        </div>
      </AdminModal>

      <style>{`
        .pin-card-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.7s ease, opacity 0.7s ease;
          transform-style: preserve-3d;
          transform: perspective(1000px) rotateX(0deg) scale(1);
        }
        .group:hover .pin-card-wrapper {
          transform: perspective(1000px) rotateX(40deg) scale(0.85) translateY(20px);
          opacity: 0.4;
          box-shadow: 0 50px 80px -20px rgba(16, 185, 129, 0.2);
        }

        .pin-links-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateZ(50px);
          opacity: 0;
          transition: opacity 0.7s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          z-index: 50;
          pointer-events: none;
        }
        .group:hover .pin-links-container {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 relative"
        >
          <div className="flex justify-center items-center gap-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Innovation Showcase</h2>
            {isAdmin && (
              <button onClick={openAddModal} className="px-5 py-2 mt-[-1rem] shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center gap-2 font-bold shadow-lg">
                <Plus className="w-5 h-5" /> Add Project
              </button>
            )}
          </div>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full" />
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-[3rem] border border-slate-800 border-dashed">
            <Code className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No projects publicized yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 justify-items-center pt-10">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative w-[354px] h-[354px] flex items-center justify-center cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  {/* Admin Controls Floating Top Right */}
                  {isAdmin && (
                    <div className="absolute -top-4 -right-4 flex gap-2 z-[60] bg-slate-900 p-2 rounded-full border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => openEditModal(e, project)} className="p-2 bg-blue-500 hover:bg-blue-400 text-white rounded-full">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => handleDelete(e, project._id)} className="p-2 bg-red-500 hover:bg-red-400 text-white rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Background Card that tilts away (Normal by default) */}
                  <div className="pin-card-wrapper shadow-2xl bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden flex flex-col transition-colors">
                    {/* Image Section */}
                    <div className="w-full h-[45%] bg-slate-800 relative overflow-hidden flex-shrink-0">
                      {project.image ? (
                        <img
                          src={project.image}
                          // alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800/80">
                          <Code className="w-16 h-16 text-emerald-500/50 mb-2" />
                          <span className="text-slate-400 font-mono text-sm">No Preview Image</span>
                        </div>
                      )}

                      {project.featured && (
                        <div className="absolute top-4 left-4 z-20 bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-grow p-6 justify-start overflow-hidden">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-lg font-extrabold text-white mb-2 line-clamp-1">
                        {project.title}
                      </h3>

                      <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="mt-auto pt-3 border-t border-slate-800/50 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-500">#{project._id.slice(-6)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Aceternity 3D Pin Overlay Container */}
                  <div className="pin-links-container">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex items-center justify-center group/btn pointer-events-auto"
                      >
                        <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full group-hover/btn:bg-emerald-400/50 transition-colors duration-300" />
                        <div className="relative flex items-center gap-2 px-6 py-2.5 bg-slate-950/90 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-bold whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover/btn:text-white group-hover/btn:border-emerald-400 transition-all">
                          <ExternalLink className="w-4 h-4" /> Visit Site
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-10 bg-gradient-to-b from-emerald-500 to-transparent group-hover/btn:h-12 transition-all duration-300" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex items-center justify-center group/btn pointer-events-auto"
                      >
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover/btn:bg-blue-400/40 transition-colors duration-300" />
                        <div className="relative flex items-center gap-2 px-6 py-2.5 bg-slate-950/90 border border-blue-500/30 rounded-full text-blue-400 text-sm font-bold whitespace-nowrap shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover/btn:text-white group-hover/btn:border-blue-400 transition-all">
                          <GithubIcon className="w-4 h-4" /> GitHub Repo
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-10 bg-gradient-to-b from-blue-500 to-transparent group-hover/btn:h-12 transition-all duration-300" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
