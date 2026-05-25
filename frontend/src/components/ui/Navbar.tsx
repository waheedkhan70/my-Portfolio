'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, Brain, FolderCode, Mail, FileText, Code, LogOut, ShieldCheck } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Technical Prowess', href: '#skills', icon: Brain },
  { name: 'Projects', href: '#projects', icon: Code },
  { name: 'Resume', href: '#resume', icon: FileText },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = !!session;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 transition-all">
      <div className={`max-w-6xl mx-auto flex items-center justify-between px-6 py-3 rounded-full border transition-all ${scrolled
          ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl'
          : 'bg-transparent border-transparent'
        }`}>

        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <span className="text-white font-bold">W</span>
          </div>
          <span className="text-white font-bold tracking-tight hidden sm:block">WAHEED<span className="text-blue-500">.DEV</span></span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors hover:bg-slate-800/50 rounded-full"
            >
              {item.name}
            </a>
          ))}
          
          {isAdmin ? (
            <div className="flex items-center gap-2 ml-4">
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-2 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Admin Mode
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <a
              href="/admin/login"
              className="ml-4 px-6 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
            >
              Admin
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-20 left-4 right-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-8 shadow-2xl md:hidden flex flex-col gap-6"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 text-lg text-slate-300 hover:text-blue-400 transition-colors"
              >
                <item.icon className="w-6 h-6" />
                {item.name}
              </a>
            ))}
            <hr className="border-slate-800" />
            <a
              href="/admin/login"
              className="flex justify-center items-center py-4 bg-blue-600 text-white font-bold rounded-2xl"
            >
              Admin Access
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
