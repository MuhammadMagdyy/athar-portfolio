import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import API_BASE_URL from "./api.js";

const Admin = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [editingProject, setEditingProject] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [tempProjectName, setTempProjectName] = useState("");

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      // Previous: const res = await fetch("http://localhost:8000/api/projects");
      const res = await fetch(`${API_BASE_URL}/projects`);
      
      const data = await res.json();
      // Sort by ID descending so newest projects are always at the top
      setProjects(data.sort((a, b) => b.id - a.id));
    } catch (err) { console.error("Database connection error:", err); }
  };

  const triggerNotification = (text, type = 'info') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleConfirmDeletion = async () => {
    if (!itemToDelete) return;
    const { type, id } = itemToDelete;
    
    // Previous local endpoints:
    // const endpoint = type === 'project' ? `http://localhost:8000/api/projects/${id}` : `http://localhost:8000/api/photos/${id}`;
    const endpoint = type === 'project' 
      ? `${API_BASE_URL}/projects/${id}` 
      : `${API_BASE_URL}/photos/${id}`;

    const res = await fetch(endpoint, { method: 'DELETE' });
    if (res.ok) {
      if (type === 'project') {
        setProjects(projects.filter(p => p.id !== id));
        if (editingProject?.id === id) setEditingProject(null);
      } else {
        // Update the editing drawer UI if an image is deleted
        setEditingProject({ 
          ...editingProject, 
          photos: editingProject.photos.filter(p => p.id !== id) 
        });
      }
      triggerNotification(`${type === 'project' ? 'Collection' : 'Image'} Removed`);
    }
    setItemToDelete(null);
  };

  const handleRenameProject = async () => {
    if (!tempProjectName || !editingProject) return;

    const formData = new FormData();
    formData.append('name', tempProjectName);

    try {
      // Previous: const res = await fetch(`http://localhost:8000/api/projects/${editingProject.id}`, {
      const res = await fetch(`${API_BASE_URL}/projects/${editingProject.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        triggerNotification("Identity Updated", "success");
        setEditingProject(null); 
        fetchProjects(); 
      } else {
        triggerNotification("Update Failed", "error");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    const formData = new FormData();
    formData.append('name', newProjectName);

    // Previous: const res = await fetch("http://localhost:8000/api/projects", { method: 'POST', body: formData });
    const res = await fetch(`${API_BASE_URL}/projects`, { 
      method: 'POST', 
      body: formData 
    });

    if (res.ok) {
      const created = await res.json();
      setProjects([created, ...projects]); 
      setNewProjectName('');
      triggerNotification("Collection Initialized");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || selectedFiles.length === 0) return alert("Select project.");
    setUploading(true);
    
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('title', file.name.split('.')[0]);
      formData.append('file', file);
      formData.append('project_id', selectedProjectId);
      
      // Previous: await fetch("http://localhost:8000/api/upload", { method: 'POST', body: formData });
      await fetch(`${API_BASE_URL}/upload`, { 
        method: 'POST', 
        body: formData 
      });
    }
    
    setUploading(false);
    setSelectedFiles([]);
    triggerNotification(`Gallery Updated`, 'success');
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-[#F7F4F0] p-6 md:p-20 font-sans text-[#1A1A1A] selection:bg-[#E2D1B3]">
      
      {/* --- SECURITY CHECK MODAL --- */}
      <AnimatePresence>
        {itemToDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#1A1A1A]/95 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full text-center space-y-8"
            >
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.8em] uppercase text-[#8B735B]">Destructive Action</span>
                <h2 className="text-[#F7F4F0] text-3xl font-serif italic">Purge this {itemToDelete.type}?</h2>
                <p className="text-[#F7F4F0]/40 text-[10px] tracking-widest uppercase">This action cannot be undone.</p>
              </div>
              <div className="flex flex-col gap-3 pt-6">
                <button onClick={handleConfirmDeletion} className="bg-[#8B735B] text-[#F7F4F0] py-5 text-[10px] tracking-[0.4em] uppercase hover:bg-[#A68D74] transition-colors">Confirm Removal</button>
                <button onClick={() => setItemToDelete(null)} className="text-[#F7F4F0]/60 py-5 text-[10px] tracking-[0.4em] uppercase hover:text-[#F7F4F0] transition-colors">Go Back</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NOTIFICATION TOAST --- */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-[#F7F4F0] px-10 py-5 shadow-2xl flex items-center gap-8 min-w-max"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase">{notification.text}</span>
            {notification.type === 'success' && <Link to="/" className="text-[10px] tracking-[0.4em] text-[#8B735B] pl-8 border-l border-white/10 uppercase">View Live →</Link>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- UPDATED HEADER WITH LOGO --- */}
      <header className="mb-16 md:mb-24 flex justify-between items-end border-b border-[#8B735B]/20 pb-8">
        <div className="flex items-center gap-4">
          {/* Logo references favicon.svg in public folder */}
          <img src="/favicon.svg" alt="Athar Logo" className="h-8 md:h-12 w-auto object-contain opacity-80" />
          <div>
            <h1 className="text-[10px] tracking-[0.8em] uppercase opacity-40 mb-1">Athar</h1>
            <h2 className="text-xl md:text-3xl font-light tracking-tighter italic font-serif text-[#1A1A1A]">Visual Archive</h2>
          </div>
        </div>
        <Link to="/" className="text-[9px] tracking-widest opacity-30 uppercase hover:opacity-100 transition-opacity pb-1">Exit</Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 max-w-7xl mx-auto">
        <section>
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[10px] font-bold text-[#8B735B]">01</span>
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-medium">Initialize Collection</h3>
          </div>
          <form onSubmit={handleCreateProject} className="space-y-10">
            <input type="text" placeholder="COLLECTION TITLE" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-4 outline-none text-[11px] tracking-[0.3em] uppercase focus:border-[#8B735B] transition-all placeholder:opacity-20" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
            <motion.button whileHover={{ scale: 1.02 }} className="bg-[#1A1A1A] text-[#F7F4F0] text-[9px] tracking-[0.5em] px-12 py-5 uppercase">Create</motion.button>
          </form>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[10px] font-bold text-[#8B735B]">02</span>
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-medium">Add Media</h3>
          </div>
          <form onSubmit={handleUpload} className="space-y-10">
            <select className="w-full bg-white/50 border border-[#1A1A1A]/5 py-4 px-4 text-[10px] tracking-widest uppercase appearance-none cursor-pointer" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
              <option value="">Destination Collection...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="relative group border border-dashed border-[#8B735B]/30 p-12 md:p-16 text-center hover:bg-white/40 transition-all cursor-pointer">
              <input type="file" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="text-[10px] tracking-[0.4em] uppercase opacity-40">{selectedFiles.length > 0 ? `${selectedFiles.length} Ready` : "Select Files"}</p>
            </div>
            <button disabled={uploading} className="w-full border border-[#1A1A1A] py-5 text-[9px] tracking-[0.6em] uppercase hover:bg-[#1A1A1A] hover:text-[#F7F4F0] transition-all disabled:opacity-20">
              {uploading ? "Processing..." : "Publish"}
            </button>
          </form>
        </section>

        {/* --- ARCHIVE MANAGEMENT --- */}
        <section className="col-span-full border-t border-[#8B735B]/10 pt-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[10px] font-bold text-[#8B735B]">03</span>
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-medium">Archive Management</h3>
          </div>
          {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((proj, idx) => (
              <div 
                key={proj.id} 
                onClick={() => { setEditingProject(proj); setTempProjectName(proj.name); }}
                className="bg-white/40 p-8 md:p-10 flex justify-between items-center group border border-transparent hover:border-[#8B735B]/30 transition-all cursor-pointer shadow-sm relative overflow-hidden"
              >
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase opacity-20 mb-2">Ref. 0{idx + 1}</p>
                  <p className="text-[12px] tracking-[0.2em] uppercase font-medium group-hover:text-[#8B735B] transition-colors">{proj.name}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setItemToDelete({ type: 'project', id: proj.id }); }}
                  className="text-[12px] opacity-40 lg:opacity-0 group-hover:opacity-100 transition-all hover:opacity-100 hover:text-red-800 p-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- EDIT DRAWER --- */}
      <AnimatePresence>
        {editingProject && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full lg:w-[600px] bg-[#F7F4F0] shadow-[-30px_0_60px_rgba(0,0,0,0.1)] z-[100] p-8 md:p-12 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-16 md:mb-24">
              <button onClick={() => setEditingProject(null)} className="text-[9px] tracking-[0.5em] uppercase opacity-40 hover:opacity-100 transition-opacity">← Back</button>
              <div className="h-[1px] flex-1 mx-10 bg-[#8B735B]/10"></div>
              <span className="text-[9px] tracking-[0.5em] uppercase opacity-20">Editor</span>
            </div>

            <div className="space-y-16 md:space-y-24">
              <div className="space-y-8">
                <h4 className="text-[10px] tracking-[0.4em] uppercase text-[#8B735B]">Collection Title</h4>
                <input 
                  type="text" value={tempProjectName} onChange={(e) => setTempProjectName(e.target.value)}
                  className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-6 outline-none text-2xl md:text-3xl font-serif italic focus:border-[#8B735B] transition-all"
                />
                <button onClick={handleRenameProject} className="text-[9px] tracking-[0.4em] uppercase bg-[#1A1A1A] text-[#F7F4F0] px-10 py-4 hover:bg-[#8B735B] transition-all">Update Identity</button>
              </div>

              <div className="space-y-10">
                <h4 className="text-[10px] tracking-[0.4em] uppercase text-[#8B735B]">Collection Manifest</h4>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {editingProject.photos?.map((photo) => (
                    <div key={photo.id} className="relative aspect-[3/4] group overflow-hidden bg-[#1A1A1A]">
                      <img src={photo.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt="" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setItemToDelete({ type: 'image', id: photo.id })}
                          className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-800 transition-colors"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-24 md:mt-40 text-center opacity-20 pb-10">
         <p className="text-[8px] tracking-[1.2em] uppercase">Athar Visual Management System</p>
      </footer>
    </div>
  );
};

export default Admin;