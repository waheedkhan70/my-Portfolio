'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  
  const isLoading = status === 'submitted' || status === 'streaming';
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
    setInput('');
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] group"
      >
        {isOpen ? <X /> : <MessageCircle className="group-hover:rotate-12 transition-transform" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 w-[90vw] md:w-[400px] h-[500px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col z-[60] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-800/50 p-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                   <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Waheed's AI Assistant</h3>
                  <p className="text-xs text-emerald-400">Online & Ready</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.length === 0 && (
                <div className="text-center py-10">
                   <Bot className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                   <p className="text-slate-500 text-sm">Ask me anything about Waheed's skills, experience, or project background!</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    m.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}>
                    {m.parts?.map((p, i) => p.type === 'text' ? <span key={i}>{p.text}</span> : null)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-slate-800 p-4 rounded-2xl flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-6 bg-slate-800/30 border-t border-slate-800 flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Type a message..."
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 p-2 rounded-xl text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
