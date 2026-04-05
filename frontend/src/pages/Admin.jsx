// ==============================
// 🔹 IMPORTS
// ==============================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import API_BASE_URL from "../api.js";

const Admin = () => {
  // 🔹 STATE MANAGEMENT
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [tempProjectName, setTempProjectName] = useState("");

  // 🔹 THEME SYNC (Matching Gallery Logic)
  const [darkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // Helper to detect video files for UI rendering
  const isVideo = (url) => url && url.match(/\.(mp4|webm|mov|ogg)$/i);

  useEffect(() => { 
    fetchProjects(); 
    // Apply theme class to document for consistent styling
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`);
      const data = await res.json();
      setProjects(data.sort((a, b) => b.id - a.id));
    } catch (err) { console.error("Database connection error:", err); }
  };

  const triggerNotification = (text, type = 'info') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // ==============================
  // 🔹 ACTION HANDLERS
  // ==============================

  const handleConfirmDeletion = async () => {
    if (!itemToDelete) return;
    const { type, id } = itemToDelete;
    const endpoint = type === 'project' ? `${API_BASE_URL}/projects/${id}` : `${API_BASE_URL}/photos/${id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        if (type === 'project') {
          setProjects(projects.filter(p => p.id !== id));
          if (editingProject?.id === id) setEditingProject(null);
        } else {
          setEditingProject({ 
            ...editingProject, 
            photos: editingProject.photos.filter(p => p.id !== id) 
          });
        }
        triggerNotification(`${type === 'project' ? 'Collection' : 'Trace'} Purged`);
      }
    } catch (err) { triggerNotification("Action Failed", "error"); }
    setItemToDelete(null);
  };

  const handleRenameProject = async () => {
    if (!tempProjectName || !editingProject) return;
    const formData = new FormData();
    formData.append('name', tempProjectName);

    try {
      const res = await fetch(`${API_BASE_URL}/projects/${editingProject.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        triggerNotification("Identity Rebranded", "success");
        setEditingProject(null); 
        fetchProjects(); 
      }
    } catch (err) { console.error("Update error:", err); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    const formData = new FormData();
    formData.append('name', newProjectName);

    const res = await fetch(`${API_BASE_URL}/projects`, { method: 'POST', body: formData });
    if (res.ok) {
      const created = await res.json();
      setProjects([created, ...projects]); 
      setNewProjectName('');
      triggerNotification("New Trace Initialized");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || selectedFiles.length === 0) return triggerNotification("Select Destination", "error");
    setUploading(true);
    
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('title', file.name.split('.')[0]);
        formData.append('file', file);
        formData.append('project_id', selectedProjectId);
        await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData });
      }
      triggerNotification(`Archive Expanded`, 'success');
      fetchProjects();
    } catch (err) { triggerNotification("Upload Interrupted", "error"); }
    
    setUploading(false);
    setSelectedFiles([]);
  };

  return (
    <div className={`min-h-screen p-6 md:p-20 font-sans transition-colors duration-1000 selection:bg-athar-accent
      ${darkMode ? 'bg-athar-dark text-athar-cream' : 'bg-athar-cream text-athar-dark'}`}>
      
      {/* 🔹 SECURITY MODAL (THE PURGE) */}
      <AnimatePresence>
        {itemToDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-athar-dark/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full text-center space-y-10"
            >
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.8em] uppercase text-athar-gold">Critical Action</span>
                <h2 className="text-athar-cream text-4xl font-hero italic">Confirm Deletion</h2>
                <p className="text-athar-cream/30 text-[9px] tracking-widest uppercase">This trace will be lost to the void.</p>
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={handleConfirmDeletion} className="bg-athar-gold text-athar-dark py-5 text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-athar-cream transition-all">Destroy</button>
                <button onClick={() => setItemToDelete(null)} className="text-athar-cream/40 py-5 text-[10px] tracking-[0.5em] uppercase hover:text-white transition-all underline underline-offset-8 decoration-athar-gold/20">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] glass-panel px-10 py-5 shadow-2xl border-athar-gold/20 flex items-center gap-12"
          >
            <span className="text-[10px] tracking-[0.5em] uppercase font-medium">{notification.text}</span>
            {notification.type === 'success' && <Link to="/" className="text-[9px] tracking-[0.4em] text-athar-gold hover:text-athar-cream transition-colors uppercase pl-8 border-l border-athar-gold/20">Live View</Link>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 HEADER */}
      <header className="mb-24 flex justify-between items-end border-b border-athar-gold/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-[0.6em] uppercase opacity-40 font-bold text-athar-gold">System: 02</span>
            <div className="h-[1px] w-12 bg-athar-gold/30"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-hero italic tracking-tight">Management</h1>
        </div>
        <Link to="/" className="text-[9px] tracking-[0.5em] opacity-30 uppercase hover:opacity-100 hover:text-athar-gold transition-all pb-2">Exit System</Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 md:gap-40 max-w-[1600px] mx-auto">
        
        {/* 🔹 STEP 01: INITIALIZE */}
        <section className="space-y-12">
          <div className="flex items-center gap-6">
            <span className="font-serif italic text-3xl text-athar-gold opacity-40">01</span>
            <h3 className="text-[11px] tracking-[0.6em] uppercase font-bold">New Archive</h3>
          </div>
          <form onSubmit={handleCreateProject} className="space-y-10 group">
            <input 
              type="text" 
              placeholder="COLLECTION_NAME" 
              className="w-full bg-transparent border-b border-athar-gold/20 py-6 outline-none text-xl md:text-2xl font-hero italic tracking-wider focus:border-athar-gold transition-all placeholder:opacity-10" 
              value={newProjectName} 
              onChange={(e) => setNewProjectName(e.target.value)} 
            />
            <motion.button whileTap={{ scale: 0.95 }} className="bg-athar-gold text-athar-dark text-[10px] tracking-[0.6em] px-16 py-5 uppercase font-bold hover:bg-athar-cream transition-all">Initialize</motion.button>
          </form>
        </section>

        {/* 🔹 STEP 02: INGESTION */}
        <section className="space-y-12">
          <div className="flex items-center gap-6">
            <span className="font-serif italic text-3xl text-athar-gold opacity-40">02</span>
            <h3 className="text-[11px] tracking-[0.6em] uppercase font-bold">Trace Ingestion</h3>
          </div>
          <form onSubmit={handleUpload} className="space-y-10">
            <div className="relative">
                <select className="w-full bg-athar-dark/5 dark:bg-white/5 border border-athar-gold/10 py-5 px-6 text-[10px] tracking-[0.3em] uppercase appearance-none cursor-pointer focus:border-athar-gold transition-all" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                <option value="" className="bg-athar-dark">Select Target...</option>
                {projects.map(p => <option key={p.id} value={p.id} className="bg-athar-dark">{p.name}</option>)}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[8px]">▼</div>
            </div>
            
            <div className="relative group border border-dashed border-athar-gold/20 p-16 text-center hover:border-athar-gold/50 transition-all cursor-pointer bg-white/2 dark:bg-white/5">
              <input type="file" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="space-y-4">
                <div className="text-[30px] font-thin opacity-20 group-hover:opacity-100 group-hover:text-athar-gold transition-all">+</div>
                <p className="text-[9px] tracking-[0.5em] uppercase opacity-40">{selectedFiles.length > 0 ? `${selectedFiles.length} Selected` : "Drop Media Files"}</p>
              </div>
            </div>
            
            <button disabled={uploading} className="w-full border border-athar-gold/30 py-5 text-[10px] tracking-[0.8em] uppercase hover:bg-athar-gold hover:text-athar-dark transition-all disabled:opacity-10 font-bold">
              {uploading ? "Uploading Trace..." : "Publish to Archive"}
            </button>
          </form>
        </section>

        {/* 🔹 STEP 03: MANAGEMENT */}
        <section className="col-span-full border-t border-athar-gold/10 pt-24 mt-12">
          <div className="flex items-center gap-6 mb-16">
            <span className="font-serif italic text-3xl text-athar-gold opacity-40">03</span>
            <h3 className="text-[11px] tracking-[0.6em] uppercase font-bold">Archive Management</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((proj, idx) => (
              <motion.div 
                key={proj.id} 
                whileHover={{ y: -5 }}
                onClick={() => { setEditingProject(proj); setTempProjectName(proj.name); }}
                className="glass-panel p-10 flex flex-col justify-between group border-athar-gold/10 hover:border-athar-gold/40 transition-all cursor-pointer aspect-square relative"
              >
                <div>
                  <p className="text-[8px] tracking-[0.5em] uppercase opacity-20 mb-4">№ 0{idx + 1}</p>
                  <h4 className="text-lg tracking-tight font-hero italic group-hover:text-athar-gold transition-colors">{proj.name}</h4>
                  <p className="text-[7px] tracking-[0.4em] uppercase opacity-30 mt-2">{proj.photos?.length || 0} Assets</p>
                </div>
                
                <div className="flex justify-between items-center mt-8">
                    <span className="text-[7px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-40 transition-opacity">Edit Project</span>
                    <button 
                    onClick={(e) => { e.stopPropagation(); setItemToDelete({ type: 'project', id: proj.id }); }}
                    className="text-athar-gold opacity-20 group-hover:opacity-100 transition-all hover:text-red-500"
                    >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                    </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* 🔹 EDIT DRAWER */}
      <AnimatePresence>
        {editingProject && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 right-0 w-full lg:w-[700px] z-[250] p-12 overflow-y-auto border-l border-athar-gold/10
                        ${darkMode ? 'bg-athar-dark text-athar-cream shadow-[-50px_0_100px_rgba(0,0,0,0.5)]' : 'bg-athar-cream text-athar-dark shadow-[-50px_0_100px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="flex justify-between items-center mb-24">
              <button onClick={() => setEditingProject(null)} className="text-[9px] tracking-[0.5em] uppercase opacity-40 hover:opacity-100 hover:text-athar-gold transition-all">← Close</button>
              <span className="text-[8px] tracking-[1em] uppercase opacity-20">Trace Editor</span>
            </div>

            <div className="space-y-24">
              <div className="space-y-10">
                <p className="text-[9px] tracking-[0.5em] uppercase text-athar-gold">Redefine Identity</p>
                <input 
                  type="text" value={tempProjectName} onChange={(e) => setTempProjectName(e.target.value)}
                  className="w-full bg-transparent border-b border-athar-gold/10 py-6 outline-none text-4xl md:text-5xl font-hero italic focus:border-athar-gold transition-all"
                />
                <button onClick={handleRenameProject} className="text-[9px] tracking-[0.5em] uppercase bg-athar-gold text-athar-dark px-12 py-5 font-bold hover:bg-athar-cream transition-all">Update Identity</button>
              </div>

              <div className="space-y-12">
                <p className="text-[9px] tracking-[0.5em] uppercase text-athar-gold">Asset Management</p>
                <div className="grid grid-cols-2 gap-6">
                  {editingProject.photos?.map((photo) => (
                    <motion.div key={photo.id} layout className="relative aspect-[4/5] group overflow-hidden bg-white/5 border border-athar-gold/5">
                      {isVideo(photo.url) ? (
                        <video src={photo.url} className="w-full h-full object-cover grayscale brightness-75" muted />
                      ) : (
                        <img src={photo.url} className="w-full h-full object-cover grayscale brightness-75" alt="" />
                      )}

                      <div className="absolute inset-0 bg-athar-dark/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                        <button 
                          onClick={() => setItemToDelete({ type: 'image', id: photo.id })}
                          className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-full text-white hover:bg-red-900 hover:border-red-900 transition-all"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-40 text-center opacity-10 pb-10">
         <p className="text-[7px] tracking-[1.5em] uppercase">Athar Visual Management System — Muhammad Magdy Studio</p>
      </footer>
    </div>
  );
};

export default Admin;