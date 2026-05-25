'use client';

import { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Edit2, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import AdminModal from '../ui/AdminModal';
import { apiUrl } from '@/lib/api';

// Represents an embeddings data manifold (ML concept)
const DataCloud = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 2000;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
       pos[i*3] = (Math.random() - 0.5) * 25; // X
       pos[i*3+1] = (Math.random() - 0.5) * 25; // Y
       pos[i*3+2] = (Math.random() - 0.5) * 15; // Z

       const mix = Math.random();
       cols[i*3] = mix > 0.5 ? 0.3 : 0.1; // R
       cols[i*3+1] = mix > 0.5 ? 0.7 : 0.3; // G
       cols[i*3+2] = 1.0; // B
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.08;
        pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation={true} />
    </points>
  );
};

// Represents the hidden layers / neural processing core
const NeuralCore = () => {
    const coreRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (coreRef.current) {
            coreRef.current.rotation.x = time * 0.2;
            coreRef.current.rotation.y = time * 0.3;
        }
        if (ringRef.current) {
            ringRef.current.rotation.x = time * -0.15;
            ringRef.current.rotation.y = time * -0.25;
        }
        if (innerRef.current) {
            innerRef.current.rotation.x = time * 0.5;
            innerRef.current.rotation.z = time * 0.5;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            {/* Deep Learning Core Node */}
            <mesh ref={innerRef}>
                <octahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} wireframe={false} />
            </mesh>

            {/* Neural Network Hidden Layers (Wireframes) */}
            <mesh ref={coreRef}>
                <icosahedronGeometry args={[1.5, 1]} />
                <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.4} emissive="#1d4ed8" emissiveIntensity={0.5} />
            </mesh>
            
            <mesh ref={ringRef}>
                <torusGeometry args={[3, 0.1, 16, 100]} />
                <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.15} emissive="#047857" emissiveIntensity={0.5}/>
            </mesh>

            <Sparkles count={400} scale={20} size={2} speed={1.5} opacity={0.8} color="#93c5fd" />
            <Sparkles count={200} scale={25} size={3} speed={2} opacity={0.6} color="#34d399" />
            <Sparkles count={150} scale={30} size={2.5} speed={1} opacity={0.5} color="#c084fc" />
        </Float>
    );
};

export default function HeroScene() {
  const { data: session } = useSession();
  const isAdmin = !!session;

  const [heroData, setHeroData] = useState({
    heroTagline: "Deep Learning & Neural Architectures",
    heroTitle: "Waheedur Rahman",
    heroSubtitle: "Pioneering the next era of Artificial Intelligence and building the intelligent web interface of tomorrow."
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(heroData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(apiUrl('/profile'))
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch hero data: ${res.status} ${res.statusText}. ${errorText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data._id) {
          setHeroData({
            heroTagline: data.heroTagline || heroData.heroTagline,
            heroTitle: data.heroTitle || heroData.heroTitle,
            heroSubtitle: data.heroSubtitle || heroData.heroSubtitle
          });
          setEditForm({
            heroTagline: data.heroTagline || heroData.heroTagline,
            heroTitle: data.heroTitle || heroData.heroTitle,
            heroSubtitle: data.heroSubtitle || heroData.heroSubtitle
          });
        }
      })
      .catch(err => console.error("Could not fetch hero data", err));
  }, []);

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
      setHeroData({
        heroTagline: data.heroTagline,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error("Save hero error:", err);
      alert(err.message || "Failed to save hero data. Please check if the backend is running and the database is connected.");
    }
    setIsSaving(false);
  };

  return (
    <section id="home" className="relative w-full h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      <AdminModal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Hero Section">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Tagline</label>
            <input 
              type="text" value={editForm.heroTagline} 
              onChange={e => setEditForm({...editForm, heroTagline: e.target.value})} 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Main Title</label>
            <input 
              type="text" value={editForm.heroTitle} 
              onChange={e => setEditForm({...editForm, heroTitle: e.target.value})} 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Subtitle</label>
            <textarea 
              value={editForm.heroSubtitle} 
              onChange={e => setEditForm({...editForm, heroSubtitle: e.target.value})} 
              className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" /> {isSaving ? "Saving..." : "Save Hero"}
          </button>
        </div>
      </AdminModal>

      {/* 3D Neural Network Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
          
          <NeuralCore />
          <DataCloud />
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
        </Canvas>
      </div>

      {/* Hero UI Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mt-10">
        {isAdmin && (
           <button 
             onClick={() => setIsEditing(true)}
             className="mb-6 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
           >
             <Edit2 className="w-4 h-4" /> Edit Hero Section
           </button>
        )}

        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wider uppercase backdrop-blur-md"
        >
           {heroData.heroTagline}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-500 mb-6 pb-2"
        >
          {heroData.heroTitle}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-300 max-w-2xl font-light"
        >
          {heroData.heroSubtitle}
        </motion.p>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.6 }}
           className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a href="#projects" className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/30 border border-blue-400/50 cursor-pointer text-center">
            Explore Models & Projects
          </a>
          <a href="#contact" className="px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-600 shadow-xl shadow-slate-900/50 cursor-pointer text-center group">
            Establish Connection <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
