// ==============================
// 🔹 IMPORTS
// ==============================
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Masonry from 'react-masonry-css';
import API_BASE_URL from "../api.js";

const ProjectDetail = () => {
  const { id } = useParams(); 

  // ==============================
  // 🔹 STATE MANAGEMENT
  // ==============================
  const [project, setProject] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // 🔹 THEME SYNC (Matching Admin/Gallery Logic)
  const [darkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // ==============================
  // 🔹 THEME & DATA EFFECT
  // ==============================
  useEffect(() => {
    // 1. Force document theme based on state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Fetch Project Data
    fetch(`${API_BASE_URL}/projects/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.error("Error fetching detail:", err));
  }, [id, darkMode]);

  // ==============================
  // 🔹 HELPER FUNCTIONS
  // ==============================
  const isVideo = (url) => url && url.match(/\.(mp4|webm|mov|ogg)$/i);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedMedia(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const downloadMedia = (e, url, title) => {
    e.stopPropagation();
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobURL = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = title || "athar-archive-item";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  // ==============================
  // 🔹 LOADING STATE
  // ==============================
  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-1000 ${darkMode ? 'bg-athar-dark' : 'bg-athar-cream'}`}>
        <div className="text-[10px] tracking-[1em] uppercase text-athar-gold animate-pulse">
          Analyzing Trace...
        </div>
      </div>
    );
  }

  // ==============================
  // 🔹 MAIN UI RENDER
  // ==============================
  return (
    <div className={`min-h-screen transition-colors duration-1000 selection:bg-athar-accent ${darkMode ? 'bg-athar-dark text-athar-cream' : 'bg-athar-cream text-athar-dark'}`}>
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-athar-gold z-[100] origin-left" 
        style={{ scaleX }} 
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center pointer-events-none">
        <Link 
          to="/" 
          className="pointer-events-auto text-[9px] tracking-[0.5em] uppercase text-athar-gold hover:opacity-60 transition-all flex items-center gap-4 group"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Return
        </Link>
        <div className="text-[9px] tracking-[0.5em] uppercase opacity-20 transition-colors hidden md:block">
          {project.name} // Trace Archive
        </div>
      </nav>

      {/* Header */}
      <header className="pt-48 pb-24 text-center px-6">
        <motion.h1 
          layoutId={`title-${id}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-8xl tracking-tighter font-hero italic font-light leading-tight"
        >
          {project.name}
        </motion.h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          className="h-[1px] bg-athar-gold/30 mx-auto mt-12" 
        />
      </header>

      {/* Gallery Grid - Max width reduced for smaller image feel */}
      <main className="max-w-[1200px] mx-auto py-10 px-8">
        <Masonry 
          breakpointCols={{ default: 2, 1100: 2, 700: 1 }} 
          className="flex -ml-16 w-auto"
          columnClassName="pl-16"
        >
          {project.photos.map((photo, idx) => (
            <motion.div 
              key={photo.id} 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-40 group relative cursor-pointer"
              onClick={() => setSelectedMedia(photo)}
            >
              
              <button 
                onClick={(e) => downloadMedia(e, photo.url, photo.title)}
                className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 
                           bg-athar-dark/10 dark:bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 hover:bg-athar-gold hover:scale-110 shadow-xl"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>

              {/* Media Container with Zoom & Lift Animation */}
              <div className="overflow-hidden bg-athar-gold/5 shadow-xl group-hover:shadow-2xl transition-all duration-700 relative">
                {isVideo(photo.url) ? (
                  <video 
                    src={photo.url} 
                    autoPlay loop muted playsInline
                    className="w-full brightness-100 transition-all duration-[1.5s] ease-out group-hover:scale-110"
                  />
                ) : (
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full brightness-100 transition-all duration-[1.5s] ease-out group-hover:scale-110" 
                  />
                )}
                <div className="absolute inset-0 border border-athar-gold/5 group-hover:border-athar-gold/20 transition-colors pointer-events-none" />
              </div>

              <div className="mt-8 flex justify-between items-baseline">
                <div>
                  <h4 className="text-[10px] tracking-[0.6em] uppercase opacity-40 group-hover:opacity-100 group-hover:text-athar-gold transition-all duration-500">
                    {photo.title || "Untitled Trace"}
                  </h4>
                  <p className="text-[7px] tracking-[0.3em] uppercase opacity-20 mt-2">
                    Visual Recording / 2026
                  </p>
                </div>
                <span className="text-[8px] font-serif italic text-athar-gold opacity-50">№ 0{idx + 1}</span>
              </div>

            </motion.div>
          ))}
        </Masonry>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-athar-dark/98 backdrop-blur-3xl flex items-center justify-center p-6 md:p-20"
          >
            <div className="absolute top-10 right-10 flex gap-8 z-[1010]">
              <button 
                onClick={(e) => downloadMedia(e, selectedMedia.url, selectedMedia.title)}
                className="text-white/30 hover:text-athar-gold transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
              <button 
                onClick={() => setSelectedMedia(null)}
                className="text-white/30 hover:text-white transition-all hover:rotate-90 duration-500"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-full max-h-full flex flex-col items-center justify-center"
            >
              {isVideo(selectedMedia.url) ? (
                <video src={selectedMedia.url} controls autoPlay loop className="max-w-full max-h-[80vh] object-contain shadow-2xl" />
              ) : (
                <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-[80vh] object-contain shadow-2xl" />
              )}
              <div className="mt-12 text-center space-y-2 text-white">
                <p className="text-athar-gold text-[10px] tracking-[1em] uppercase pl-[1em]">
                  {selectedMedia.title}
                </p>
                <p className="opacity-20 text-[8px] tracking-[0.5em] uppercase">Athar Visual Archive System</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-60 text-center border-t border-athar-gold/10 mx-10">
         <Link to="/" className="group inline-flex flex-col items-center gap-8">
            <span className="text-[10px] tracking-[1.5em] uppercase text-athar-gold opacity-30 group-hover:opacity-100 group-hover:tracking-[2em] transition-all duration-700">Return to Gallery</span>
            <div className="w-px h-24 bg-athar-gold/20 group-hover:h-32 transition-all duration-1000" />
         </Link>
         <div className="mt-20 opacity-10 text-[7px] tracking-[1em] uppercase">Muhammad Magdy Studio © 2026</div>
      </footer>

    </div>
  );
};

export default ProjectDetail;