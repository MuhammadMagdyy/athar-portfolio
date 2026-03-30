import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from "framer-motion";
import API_BASE_URL from "../api"; // Assuming api.js is in /src

const Project = () => {
  const { id } = useParams(); 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    // Previous: fetch(`http://localhost:8000/api/projects/${id}`)
    fetch(`${API_BASE_URL}/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching project details:", err));
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-[#F7F4F0] flex items-center justify-center">
      <p className="text-[10px] tracking-[1em] uppercase opacity-20 animate-pulse">Loading Editorial...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-[#F7F4F0] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#E2D1B3]"
    >
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#8B735B] z-[100] origin-left" style={{ scaleX }} />

      <nav className="fixed top-10 left-10 z-50">
        <Link to="/" className="group flex items-center gap-4">
          <span className="text-[10px] tracking-[0.5em] uppercase opacity-40 group-hover:opacity-100 group-hover:text-[#8B735B] transition-all">
            ← Index
          </span>
        </Link>
      </nav>

      <header className="pt-40 pb-20 px-10 text-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-light tracking-tighter italic font-serif mb-6"
        >
          {project?.name}
        </motion.h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          className="h-[1px] bg-[#8B735B]/40 mx-auto"
        />
      </header>

      <main className="max-w-[1200px] mx-auto px-6 pb-60 space-y-40 md:space-y-80">
        {project?.photos?.map((photo, index) => (
          <motion.section 
            key={photo.id}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}
          >
            <div className="relative w-full md:w-[85%] shadow-2xl overflow-hidden bg-white/50">
               <img 
                 src={photo.url} 
                 alt={photo.title} 
                 className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-[2s]"
               />
            </div>
            
            <div className={`mt-8 ${index % 2 === 0 ? 'text-left pl-2' : 'text-right pr-2'}`}>
              <p className="text-[9px] tracking-[0.6em] uppercase opacity-30">{photo.title}</p>
              <p className="text-[8px] tracking-[0.3em] uppercase opacity-10 mt-1">Athar Archive / 0{index + 1}</p>
            </div>
          </motion.section>
        ))}
      </main>

      <footer className="py-40 bg-white/30 text-center border-t border-[#8B735B]/10">
        <p className="text-[10px] tracking-[1.5em] uppercase opacity-30 mb-10">End of Collection</p>
        <Link 
          to="/" 
          className="text-[11px] tracking-[0.6em] uppercase border border-[#1A1A1A] px-12 py-5 hover:bg-[#1A1A1A] hover:text-[#F7F4F0] transition-all"
        >
          Return to Index
        </Link>
      </footer>
    </motion.div>
  );
};

export default Project;