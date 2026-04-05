// ==============================
// 🔹 IMPORTS
// ==============================

// React hook for managing component state
import React, { useState } from 'react';

// Animation utilities for smooth UI transitions
import { motion, AnimatePresence } from "framer-motion";

// Used for navigation (back to home page)
import { Link } from 'react-router-dom';


// ==============================
// 🔹 PROTECTED ROUTE COMPONENT
// This component restricts access to certain routes (e.g. /admin)
// If user is NOT authorized → show login screen
// If authorized → render children (Admin page)
// ==============================
const ProtectedRoute = ({ children }) => {

  // ==============================
  // 🔹 STATE MANAGEMENT
  // ==============================

  // Stores user input (admin key)
  const [inputKey, setInputKey] = useState("");

  // Controls error message visibility
  const [error, setError] = useState(false);
  

  // ==============================
  // 🔹 AUTHENTICATION SETUP
  // ==============================

  // Admin key stored in environment variables (Vite)
  // NOTE: Must be defined as VITE_ADMIN_KEY in .env
  const adminKey = import.meta.env.VITE_ADMIN_KEY;

  // Check if user is already authorized (saved in browser storage)
  const isAuthorized = localStorage.getItem('athar_access') === adminKey;


  // ==============================
  // 🔹 LOGIN HANDLER
  // Runs when user submits the form
  // ==============================
  const handleLogin = (e) => {
    e.preventDefault();

    // 🔹 If entered key matches the admin key
    if (inputKey === adminKey) {

      // Save access key in localStorage
      localStorage.setItem('athar_access', inputKey);

      // Reload page to re-check authorization
      window.location.reload(); 

    } else {
      // 🔹 Show error message
      setError(true);

      // Hide error after 2 seconds
      setTimeout(() => setError(false), 2000);
    }
  };


  // ==============================
  // 🔹 UNAUTHORIZED VIEW (LOCK SCREEN)
  // If user is NOT authorized → show login UI
  // ==============================
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center p-6 font-sans selection:bg-[#E2D1B3]">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full space-y-12 text-center"
        >

          {/* ============================== */}
          {/* 🔹 HEADER SECTION */}
          {/* ============================== */}
          <header className="space-y-4">
            
            {/* Logo */}
            <div className="flex justify-center mb-8">
               <img src="/favicon.svg" alt="Logo" className="h-12 w-auto opacity-80" />
            </div>

            {/* Subtitle */}
            <span className="text-[10px] tracking-[0.8em] uppercase opacity-40">
              Security Protocol
            </span>

            {/* Title */}
            <h2 className="text-3xl font-light italic font-serif text-[#1A1A1A]">
              Access Restricted
            </h2>
          </header>


          {/* ============================== */}
          {/* 🔹 LOGIN FORM */}
          {/* ============================== */}
          <form onSubmit={handleLogin} className="space-y-8">

            {/* Input Field */}
            <div className="relative">
              <input 
                type="password" 
                placeholder="ENTER ARCHIVE KEY" 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}

                // Dynamic styling based on error state
                className={`w-full bg-transparent border-b ${
                  error ? 'border-red-800' : 'border-[#1A1A1A]/10'
                } py-4 outline-none text-[11px] tracking-[0.4em] uppercase 
                focus:border-[#8B735B] transition-all placeholder:opacity-20 text-center`}
              />

              {/* Error Message Animation */}
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-6 left-0 right-0 text-[8px] tracking-widest text-red-800 uppercase"
                  >
                    Invalid Credentials
                  </motion.p>
                )}
              </AnimatePresence>
            </div>


            {/* ============================== */}
            {/* 🔹 ACTION BUTTONS */}
            {/* ============================== */}
            <div className="flex flex-col gap-4 pt-4">

              {/* Submit Button */}
              <button 
                type="submit"
                className="bg-[#1A1A1A] text-[#F7F4F0] text-[9px] tracking-[0.5em] py-5 uppercase hover:bg-[#8B735B] transition-colors"
              >
                Unlock Archive
              </button>

              {/* Back to Home */}
              <Link 
                to="/" 
                className="text-[9px] tracking-widest opacity-30 uppercase hover:opacity-100 transition-opacity"
              >
                Return to Gallery
              </Link>
            </div>
          </form>


          {/* ============================== */}
          {/* 🔹 FOOTER */}
          {/* ============================== */}
          <footer className="pt-12 opacity-20">
            <p className="text-[8px] tracking-[1.2em] uppercase">
              Athar Encryption System
            </p>
          </footer>

        </motion.div>
      </div>
    );
  }


  // ==============================
  // 🔹 AUTHORIZED VIEW
  // If user is authorized → render protected content (Admin page)
  // ==============================
  return children;
};


// Export component for use in routing
export default ProtectedRoute;