# Athar: Visual Trace Studio 🏛️

**Athar** (أثر) is a high-fidelity visual archiving platform designed to curate and manage geographic "traces." The system balances a minimalist, immersive public gallery with a powerful, industrial-grade administrative backend.

## 📖 Table of Contents
* [The Public Experience](#the-public-experience)
* [The Admin Management System](#the-admin-management-system)
* [Technical Architecture](#technical-architecture)
* [Getting Started](#getting-started)

---

## 🎨 The Public Experience

### 1. Immersive Multi-Mode Landing
The entry point features a high-contrast design that adapts to the user's aesthetic preference. It uses refined serif typography and a central focal point to establish the brand identity.

| **Dark Mode (Default)** | **Light Mode (Clean)** |
|---|---|
| ![Landing Dark](https://github.com/MuhammadMagdyy/athar-portfolio/raw/main/dark.png) | ![Landing Light](https://github.com/MuhammadMagdyy/athar-portfolio/raw/main/screenshots/light.png) |
| *Figure 1: Hero section with glow-active branding.* | *Figure 2: Hero section in minimalist light mode.* |

### 2. The Gallery Overview
The public gallery organizes visual traces by global location. Each project card displays the city name, national flag, and an "Inspect Trace" overlay for user interaction.

<p align="center">
  <img src="https://github.com/MuhammadMagdyy/athar-portfolio/raw/main/gallery.png" />
  <br><em>Figure 3: Scrollable gallery view showcasing Port Said and Ulm archives.</em>
</p>

### 3. Project Detail View
When a user "inspects" a trace, the system transitions to a dedicated project view. This layout prioritizes imagery, providing high-resolution previews and download capabilities for specific assets.

<p align="center">
  <img src="https://github.com/MuhammadMagdyy/athar-portfolio/raw/main/gallerydetailed.png" width="90%" alt="Project Detail" />
  <br><em>Figure 4: Detailed view for the Ulm, Germany archive.</em>
</p>

---

## 🛠️ The Admin Management System

The **Athar Management System** is a private-tier dashboard designed for curators to orchestrate the studio's output. It provides a full CRUD (Create, Read, Update, Delete) interface for geographic archives.

### 1. System Access & Security
Access to administrative tools is gated by a dedicated "Access System" interface, ensuring that curation tools and professional design metadata remain protected.

<p align="center">
  <img src="https://github.com/MuhammadMagdyy/athar-portfolio/raw/main/screenshots/Image%2011-05-2026%20at%201.12%20PM.png" width="85%" alt="Access System Gate" />
  <br><em>Figure 5: The administrative entry point for system authentication.</em>
</p>

### 2. The Management Dashboard
Once authenticated, the user enters the **System: 02** dashboard. This interface is built for high-speed content ingestion and collection initialization.

<p align="center">
  <img src="https://github.com/MuhammadMagdyy/athar-portfolio/raw/main/screenshots/admin.png" width="95%" alt="Main Management Dashboard" />
  <br><em>Figure 6: The core Management interface featuring Archive Initialization and Trace Ingestion.</em>
</p>

* **01 New Archive:** Initialize a collection by entering a unique collection name.
* **02 Trace Ingestion:** Select a target city and upload assets via a drag-and-drop media zone.

### 3. Archive Fleet Overview
The **Archive Management** section provides a bird's-eye view of all active collections, including live asset counts for each geographic location.

<p align="center">
  <img src="https://github.com/MuhammadMagdyy/athar-portfolio/raw/main/screenshots/projectsviewinadmin.png" width="95%" alt="Archive Management Fleet" />
  <br><em>Figure 7: Fleet overview showing active projects like Unterwalden, Copenhagen, and Barcelona.</em>
</p>

### 4. The Trace Editor (Granular Control)
For existing archives, the **Trace Editor** provides a side-panel interface to modify metadata or manage individual assets without leaving the dashboard.

<p align="center">
  <img src="https://github.com/MuhammadMagdyy/athar-portfolio/raw/main/screenshots/projectmanagement.png" width="95%" alt="Trace Editor Sidebar" />
  <br><em>Figure 8: Using the "Redefine Identity" tool and managing assets for specific traces.</em>
</p>

---

## 💻 Technical Architecture

* **Frontend Ecosystem:** Built with **React** to handle dynamic transitions between public views and management panels.
* **Backend Services:** Powered by **FastAPI** for robust asset handling, ingestion pipelines, and metadata management.
* **Design Language:** Custom minimalist UI with dark-mode focus, high-contrast serif typography, and support for international descriptors.

---

## 🚀 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/MuhammadMagdyy/athar-portfolio.git
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

---
*Developed by Muhammad Magdy.*
