import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import API_BASE_URL from "frontend/src/api.js"; 

const ProjectDetail = () => {
  const { id } = useParams(); 
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Previous: fetch(`http://localhost:8000/api/projects/${id}`)
    fetch(`${API_BASE_URL}/projects/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.error("Error fetching detail:", err));
  }, [id]);

  if (!project) return <div className="p-20 text-center uppercase tracking-widest text-xs opacity-50">Loading Impression...</div>;

  return (
    <div className="bg-[#F7F4F0] min-h-screen p-8 md:p-20">
      <Link to="/" className="text-[10px] tracking-[0.5em] uppercase text-[#8B735B] hover:text-[#1A1A1A] transition-colors">
        ← Return to Gallery
      </Link>

      <header className="py-20 text-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-6xl tracking-[0.6em] uppercase font-light text-[#1A1A1A]"
        >
          {project.name}
        </motion.h1>
      </header>

      <Masonry breakpointCols={{ default: 3, 1100: 2, 700: 1 }} className="flex -ml-10 w-auto" columnClassName="pl-10">
        {project.photos.map((photo) => (
          <motion.div key={photo.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-10">
            <img src={photo.url} alt={photo.title} className="w-full shadow-lg grayscale hover:grayscale-0 transition-all duration-700" />
            <p className="mt-4 text-[9px] tracking-widest uppercase text-[#8B735B]">{photo.title}</p>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
};

export default ProjectDetail;