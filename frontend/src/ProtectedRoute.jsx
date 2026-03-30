import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState(false);
  
  // Note: Ensure VITE_ADMIN_KEY is set in your Render Environment Variables
  const adminKey = import.meta.env.VITE_ADMIN_KEY;
  const isAuthorized = localStorage.getItem('athar_access') === adminKey;

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputKey === adminKey) {
      localStorage.setItem('athar_access', inputKey);
      window.location.reload(); 
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center p-6 font-sans selection:bg-[#E2D1B3]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full space-y-12 text-center"
        >
          {/* --- LOCK SCREEN HEADER --- */}
          <header className="space-y-4">
            <div className="flex justify-center mb-8">
               <img src="/favicon.svg" alt="Logo" className="h-12 w-auto opacity-80" />
            </div>
            <span className="text-[10px] tracking-[0.8em] uppercase opacity-40">Security Protocol</span>
            <h2 className="text-3xl font-light italic font-serif text-[#1A1A1A]">Access Restricted</h2>
          </header>

          {/* --- KEY ENTRY FORM --- */}
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative">
              <input 
                type="password" 
                placeholder="ENTER ARCHIVE KEY" 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className={`w-full bg-transparent border-b ${error ? 'border-red-800' : 'border-[#1A1A1A]/10'} py-4 outline-none text-[11px] tracking-[0.4em] uppercase focus:border-[#8B735B] transition-all placeholder:opacity-20 text-center`}
              />
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute -bottom-6 left-0 right-0 text-[8px] tracking-widest text-red-800 uppercase"
                  >
                    Invalid Credentials
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button 
                type="submit"
                className="bg-[#1A1A1A] text-[#F7F4F0] text-[9px] tracking-[0.5em] py-5 uppercase hover:bg-[#8B735B] transition-colors"
              >
                Unlock Archive
              </button>
              <Link to="/" className="text-[9px] tracking-widest opacity-30 uppercase hover:opacity-100 transition-opacity">
                Return to Gallery
              </Link>
            </div>
          </form>

          <footer className="pt-12 opacity-20">
            <p className="text-[8px] tracking-[1.2em] uppercase">Athar Encryption System</p>
          </footer>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;