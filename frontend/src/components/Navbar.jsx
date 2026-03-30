import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  // Don't show the standard nav if we want a clean hero, 
  // or keep it minimal for the "Athar" vibe.
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-[100] px-10 py-8 flex justify-between items-center mix-blend-difference"
    >
      <Link to="/" className="text-[10px] tracking-[0.8em] uppercase text-white hover:opacity-50 transition-opacity">
        Athar
      </Link>
      
      <div className="flex gap-10">
        <Link to="/" className="text-[9px] tracking-[0.4em] uppercase text-white hover:text-[#8B735B] transition-colors">
          Home
        </Link>
        {/* This is the "Secret" door for Muhammad/Alissa */}
        <Link to="/admin" className="text-[9px] tracking-[0.4em] uppercase text-white/30 hover:text-white transition-colors">
          Studio
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;