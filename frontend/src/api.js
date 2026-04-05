// ==============================
// 🔹 API CONFIGURATION FILE
// Central place to define backend API base URL
// ==============================

// Base URL for all API requests
// This points to your deployed backend server (Render)
const API_BASE_URL = "https://athar-api-fb5l.onrender.com/api"; 

// ==============================
// 🔹 USAGE EXAMPLE
// Instead of writing full URLs everywhere:
// ❌ fetch("https://athar-api-fb5l.onrender.com/api/projects")
//
// You write:
// ✅ fetch(`${API_BASE_URL}/projects`)
//
// This makes the code cleaner and easier to maintain
// ==============================


// ==============================
// 🔹 WHY THIS FILE IS IMPORTANT
// ==============================

// 1. 🔹 Centralization
// Change API URL in ONE place instead of entire project

// 2. 🔹 Environment Switching (DEV vs PROD)
// In real projects, this changes depending on environment:
// - Local: http://localhost:8000/api
// - Production: https://your-api.com/api

// 3. 🔹 Cleaner Code
// Avoid repeating long URLs everywhere


// ==============================
// 🔹 EXPORT
// Makes this constant usable in other files
// ==============================
export default API_BASE_URL;