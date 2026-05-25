'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, FolderPlus, Brain, Settings, LogOut, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Terminal className="w-12 h-12 text-blue-500 animate-pulse" />
      </div>
    );
  }

  if (!session) return null;

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, color: 'text-blue-500' },
    { name: 'Manage Projects', icon: FolderPlus, color: 'text-emerald-500' },
    { name: 'Manage Skills', icon: Brain, color: 'text-purple-500' },
    { name: 'Settings & Theme', icon: Settings, color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/30 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Terminal className="w-6 h-6" />
          </div>
          <p className="font-bold text-xl tracking-tight">ADMIN<span className="text-blue-500 italic">.HUB</span></p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === 'Manage Skills') router.push('/admin/skills');
                else if (item.name === 'Overview') router.push('/admin');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors group"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-slate-400 group-hover:text-white font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => signOut()}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400 mt-1">Logged in as {session.user?.email}</p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-blue-400">SERVER ACTIVE</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Stats Cards */}
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Total Skills</p>
              <p className="text-4xl font-bold">24</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Projects Live</p>
              <p className="text-4xl font-bold">8</p>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Resume Downloads</p>
              <p className="text-4xl font-bold">142</p>
           </div>
        </div>

        {/* Action Panel */}
        <div className="mt-12 bg-gradient-to-br from-blue-600/5 to-transparent border border-blue-500/10 rounded-[2rem] p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome back, Boss.</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 text-lg">
              Manage your technical portfolio from here. Any changes you make will be updated instantly across the distributed frontend.
            </p>
            <div className="flex justify-center gap-4">
               <button className="px-8 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-500 transition-all">Add New Project</button>
               <button onClick={() => router.push('/admin/skills')} className="px-8 py-3 bg-slate-800 rounded-full font-bold hover:bg-slate-700 transition-all">Manage Skills</button>
            </div>
        </div>
      </main>
    </div>
  );
}
