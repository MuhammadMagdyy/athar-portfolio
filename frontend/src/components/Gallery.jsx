import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from "framer-motion";
import { Link } from 'react-router-dom';
import API_BASE_URL from "../api.js";

// --- ANIMATION VARIANTS ---
const letterVariant = {
  initial: { y: 150, opacity: 0, rotateX: -90, filter: "blur(10px)" },
  animate: { 
    y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)",
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

const containerVariant = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
};

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const brand = "ATHAR";

  // --- SCROLL PROGRESS LOGIC ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Previous: fetch("http://localhost:8000/api/projects")
    fetch(`${API_BASE_URL}/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Database connection failed:", err));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-[#F7F4F0] min-h-screen text-[#1A1A1A] selection:bg-[#E2D1B3] overflow-x-hidden font-sans"
    >
      
      {/* --- CINEMATIC SCROLL PROGRESS BAR --- */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#8B735B] z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* --- SECTION 1: THE SILK & SAND HERO --- */}
      <section className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
        
        {/* Animated Background Blobs */}
        <motion.div 
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[#F3E5D8] rounded-full blur-[150px] z-0"
        />

        {/* Rotating Rub el Hizb Star */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.08]"
        >
          <svg width="900" height="900" viewBox="0 0 100 100" className="text-[#8B735B]">
             <path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" stroke="currentColor" fill="none" strokeWidth="0.1" />
             <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="0.1" transform="rotate(22.5 50 50)" />
             <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="0.1" transform="rotate(67.5 50 50)" />
          </svg>
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div variants={containerVariant} initial="initial" animate="animate" className="flex justify-center">
            {brand.split("").map((char, i) => (
              <motion.h1 
                key={i}
                variants={letterVariant}
                whileHover={{ y: -20, color: "#B08D57", scale: 1.05 }}
                className="font-hero font-black text-[25vw] md:text-[18rem] lg:text-[22rem] leading-[0.8] tracking-tighter cursor-pointer
                           bg-gradient-to-b from-[#1A1A1A] to-[#6B6B6B] bg-clip-text text-transparent transition-all duration-300"
              >
                {char}
              </motion.h1>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }} className="mt-8">
            <p className="text-xs md:text-xl tracking-[1.8em] text-[#1A1A1A]/50 uppercase pl-[1.8em]">
              Alisaa Photography
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 2: THE EDITORIAL PORTALS --- */}
      <section className="px-6 md:px-24 py-40 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-40">
          {projects.length > 0 ? (
            projects.map((proj) => (
              <motion.div 
                key={proj.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <Link to={`/project/${proj.id}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#EFEEEC] shadow-2xl">
                    {proj.photos && proj.photos.length > 0 ? (
                      <img 
                        src={proj.photos[0].url} 
                        alt={proj.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[1em] opacity-20 italic">
                        Visual Pending
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-[#1A1A1A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                      <div className="bg-[#F7F4F0] px-8 py-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                        <span className="text-[9px] tracking-[0.5em] uppercase text-[#1A1A1A]">View Editorial</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-col items-center text-center">
                    <h3 className="text-[11px] md:text-sm tracking-[0.8em] uppercase text-[#1A1A1A] group-hover:text-[#8B735B] transition-colors duration-500 pl-[0.8em]">
                      {proj.name}
                    </h3>
                    <motion.div 
                      className="h-[0.5px] bg-[#8B735B]/40 mt-4"
                      initial={{ width: 0 }}
                      whileInView={{ width: "3rem" }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-[10px] uppercase tracking-[1em] text-gray-400">
                Awaiting the first impression...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION 3: REFINED FOOTER --- */}
      <footer className="py-40 text-center border-t border-[#8B735B]/10 mx-10 relative">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] md:text-[11px] tracking-[1.5em] text-[#1A1A1A]/40 uppercase pl-[1.5em]">
            Visual Impact by Alisaa
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="font-light text-[9px] md:text-[11px] tracking-[0.8em] text-[#8B735B] uppercase pl-[0.8em]">
               Muhammad Magdy Design <span className="mx-2 opacity-30">|</span> 2026
            </p>
            <Link 
              to="/admin" 
              className="mt-10 text-[7px] tracking-[1em] uppercase text-[#1A1A1A] opacity-0 hover:opacity-20 transition-opacity duration-1000 pl-[1em]"
            >
              Studio Access
            </Link>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Gallery;