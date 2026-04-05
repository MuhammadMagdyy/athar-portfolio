// ==============================
// 🔹 IMPORTS
// ==============================
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import { Link } from 'react-router-dom';
import API_BASE_URL from "../api.js";

// ==============================
// 🔹 ANIMATION CONFIGURATIONS
// ==============================

// cinematic Entrance: Letters rotate in on Y-axis
const letterVariant = {
  initial: { y: 200, opacity: 0, rotateX: -90 },
  animate: { 
    y: 0, opacity: 1, rotateX: 0,
    transition: { duration: 2, ease: [0.16, 1, 0.3, 1] } 
  }
};

const containerVariant = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } }
};

// ==============================
// 🔹 HELPER COMPONENT: MAGNETIC TEXT
// Adds tactile feedback to the branding
// ==============================
const MagneticLetter = ({ char, darkMode }) => {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const center = { x: left + width / 2, y: top + height / 2 };
    const magneticFactor = 25; 
    mouseX.set((e.clientX - center.x) / magneticFactor);
    mouseY.set((e.clientY - center.y) / magneticFactor);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block relative z-10"
    >
      <motion.h1 
        variants={letterVariant}
        whileHover={{ 
            color: "#8B735B", 
            scale: 1.05,
            skewY: 2,
            textShadow: darkMode ? "0 0 20px rgba(139, 115, 91, 0.5)" : "0 0 10px rgba(139, 115, 91, 0.2)",
            transition: { duration: 0.4 }
        }}
        className="font-hero font-light italic text-[18vw] md:text-[12rem] lg:text-[14rem] leading-none tracking-[0.02em] cursor-pointer select-none px-1"
      >
        {char}
      </motion.h1>
    </motion.div>
  );
};

// ==============================
// 🔹 GALLERY COMPONENT
// ==============================
const Gallery = () => {
  const [projects, setProjects] = useState([]);
  
  // 🔹 INITIALIZE THEME STATE
  // We check localStorage immediately so the initial state is correct.
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const brand = "ATHAR";

  // Framer Motion Scroll Progress
  const { scrollYProgress } = useScroll();
  const smoothYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scaleProgress = useTransform(smoothYProgress, [0, 1], [1, 0.95]);
  const titleOpacity = useTransform(smoothYProgress, [0, 0.2], [1, 0]);
  const scrollPromptOpacity = useTransform(smoothYProgress, [0, 0.1], [1, 0]);
  const scaleXProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // ==============================
  // 🔹 DATA FETCHING
  // ==============================
  useEffect(() => {
    fetch(`${API_BASE_URL}/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Database connection failed:", err));
  }, []);

  // ==============================
  // 🔹 THEME SYNC EFFECT
  // Whenever darkMode state changes, update the DOM and localStorage.
  // This ensures the <html> tag is always in sync with your preference.
  // ==============================
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handle manual toggle
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <motion.div 
      style={{ scale: scaleProgress }} 
      className={`min-h-screen selection:bg-athar-accent overflow-x-hidden font-sans transition-colors duration-1000 
                 ${darkMode ? 'bg-athar-dark text-athar-cream' : 'bg-athar-cream text-athar-dark'}`}
    >
      
      {/* 🔹 ENHANCED THEME TOGGLE BUTTON */}
      <motion.button 
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-10 right-10 z-[110] group focus:outline-none"
      >
        <div className="relative w-14 h-14 glass-panel rounded-full flex items-center justify-center border-athar-gold/30 group-hover:border-athar-gold transition-all duration-500 overflow-hidden">
           <AnimatePresence mode="wait">
              <motion.div 
                key={darkMode ? 'dark' : 'light'}
                initial={{ y: 20, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 45 }}
                className="text-athar-gold text-lg"
              >
                {darkMode ? "●" : "○"}
              </motion.div>
           </AnimatePresence>
           {/* Orbital Ring Decoration */}
           <div className="absolute inset-0 border border-athar-gold/10 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '8s' }} />
        </div>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-40 transition-opacity">
          {darkMode ? "Light" : "Dark"}
        </span>
      </motion.button>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-athar-gold z-[100] origin-left"
        style={{ scaleX: scaleXProgress }}
      />

      {/* ============================== */}
      {/* 🔹 SECTION 1: CINEMATIC HERO */}
      {/* ============================== */}
      <section className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-transparent">
        
        {/* Large Ghost Arabic Branding (أثر) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 3, delay: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        >
          <h2 className="text-[40vw] font-serif italic text-athar-gold translate-y-[-5%] leading-none">
            أثر
          </h2>
        </motion.div>

        {/* Ambient Glow */}
        <motion.div 
          style={{ opacity: darkMode ? 0.05 : 0.15 }}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${darkMode ? 'bg-white/10' : 'bg-athar-accent/40'}`}
          style={{ clipPath: 'circle(35% at 50% 50%)', filter: 'blur(100px)' }}
        />

        {/* 🔹 GEOMETRIC VISUALIZER */}
        <div className="geo-visualizer">
            <motion.div 
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="relative flex items-center justify-center"
            >
                <svg width="1200" height="1200" viewBox="0 0 100 100" className="text-athar-gold">
                    <path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" stroke="currentColor" fill="none" strokeWidth="0.05" />
                    <motion.circle cx="50" cy="50" r="49" stroke="currentColor" fill="none" strokeWidth="0.05" 
                        animate={{ r: [49, 45, 49], opacity: [0.1, 0.4, 0.1] }} 
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
                    />
                </svg>
            </motion.div>
        </div>

        {/* Hero Title */}
        <motion.div style={{ opacity: titleOpacity }} className="relative z-10 text-center">
          <motion.div 
            variants={containerVariant} 
            initial="initial" 
            animate="animate" 
            className="flex justify-center"
          >
            {brand.split("").map((char, i) => (
              <div key={i} className="text-reveal">
                  <MagneticLetter char={char} darkMode={darkMode} />
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, letterSpacing: "0.8em" }} 
            animate={{ opacity: 0.4, letterSpacing: "2.5em" }} 
            transition={{ delay: 1.8, duration: 2 }} 
            className="mt-6"
          >
            <p className="text-[10px] md:text-sm uppercase pl-[2.5em] font-medium tracking-normal text-athar-gold">
              Visual Trace Studio
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: scrollPromptOpacity }}
          className="absolute bottom-10 flex flex-col items-center gap-4"
        >
          <span className="text-[8px] uppercase tracking-[0.5em] opacity-40 font-bold">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-athar-gold to-transparent animate-float" />
        </motion.div>
      </section>

      {/* ============================== */}
      {/* 🔹 SECTION 2: ENHANCED PROJECT LIST */}
      {/* ============================== */}
      <section className="px-6 md:px-24 py-40 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-72">
          {projects.length > 0 ? (
            projects.map((proj, idx) => (
              <motion.div 
                key={proj.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className={`perspective-container relative group ${idx % 2 !== 0 ? "md:mt-48" : ""}`}
              >
                <Link to={`/project/${proj.id}`} className="block">
                  
                  {/* ENHANCED ALBUM UI: Expanding Golden Frame */}
                  <div className="relative">
                    {/* The Expanding Border Frame */}
                    <motion.div 
                      className="absolute -inset-4 border border-athar-gold/0 group-hover:border-athar-gold/40 transition-all duration-700 pointer-events-none"
                      initial={{ scale: 0.95 }}
                      whileHover={{ scale: 1 }}
                    />
                    
                    <motion.div className={`relative aspect-[4/5] overflow-hidden shadow-2xl transition-all duration-1000 
                                   ${darkMode ? 'bg-white/5' : 'bg-[#EFEEEC]'}`}>
                      {proj.photos && proj.photos.length > 0 ? (
                        <motion.img 
                          src={proj.photos[0].url} 
                          alt={proj.name} 
                          className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-[1em] opacity-20 italic">Awaiting Trace</div>
                      )}
                      
                      {/* Premium Reveal Overlay */}
                      <div className="absolute inset-0 bg-athar-dark/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center gap-4">
                        <div className="glass-panel px-8 py-3 border-white/20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="text-[9px] tracking-[0.5em] uppercase text-white font-bold">Inspect Trace</span>
                        </div>
                        <div className="w-12 h-[1px] bg-athar-gold/50" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-12 flex flex-col items-center">
                    <div className="flex items-center gap-4 opacity-30 text-[9px] italic mb-3">
                       <span className="font-serif">№ 0{idx + 1}</span>
                    </div>
                    <h3 className="text-[11px] md:text-xs tracking-[0.8em] uppercase group-hover:text-athar-gold group-hover:tracking-[1em] transition-all duration-700 font-medium">
                      {proj.name}
                    </h3>
                    <motion.div 
                      className="h-[1px] bg-athar-gold/30 mt-6"
                      initial={{ width: 0 }}
                      whileInView={{ width: "4rem" }}
                      transition={{ delay: 0.3, duration: 1.2 }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 opacity-20">
              <p className="text-[10px] uppercase tracking-[1em]">Repository Pending</p>
            </div>
          )}
        </div>
      </section>

      {/* ============================== */}
      {/* 🔹 SECTION 3: FOOTER */}
      {/* ============================== */}
      <footer className="py-48 text-center border-t border-athar-gold/10 mx-10 relative">
        <div className="space-y-10">
          <div className="relative inline-block">
            <motion.h4 
              whileInView={{ opacity: 0.1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              className="font-hero italic text-6xl md:text-9xl transition-all duration-1000"
            >
              Athar
            </motion.h4>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.2 }}
              className="absolute -top-4 -right-8 text-3xl font-serif text-athar-gold"
            >
              أثر
            </motion.span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[9px] tracking-[1.5em] opacity-30 uppercase pl-[1.5em]">Alissa Visual Archive</p>
            <p className="font-light text-[9px] tracking-[0.5em] text-athar-gold uppercase pl-[0.5em]">
              Muhammad Magdy Design <span className="mx-2 opacity-20">/</span> 2026
            </p>
            <Link 
              to="/admin" 
              className="mt-16 inline-block text-[7px] tracking-[1em] uppercase opacity-20 hover:opacity-100 hover:text-athar-gold transition-all"
            >
              Access System
            </Link>
          </div>
        </div>
      </footer>

    </motion.div>
  );
};

export default Gallery;