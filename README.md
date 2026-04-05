# Athar Portfolio

A modern, full-stack portfolio application built with React and FastAPI, featuring a sleek gallery interface for showcasing creative projects with image and video support.

## 🌟 Features

- **Interactive Gallery**: Beautiful masonry-style project gallery with smooth animations
- **Project Details**: Dedicated pages for each project with media display
- **Admin Panel**: Secure admin interface for managing projects and uploading media
- **Media Support**: Support for both images and videos uploaded via Cloudinary
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for all device sizes
- **FastAPI Backend**: High-performance Python API with SQLAlchemy ORM
- **PostgreSQL Database**: Robust data storage with relationships

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - Python SQL toolkit and ORM
- **PostgreSQL** - Advanced open source relational database
- **Cloudinary** - Cloud-based image and video management
- **Uvicorn** - ASGI web server implementation

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library for React
- **React Router** - Declarative routing for React
- **React Masonry CSS** - Masonry layout for React

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL database
- Cloudinary account (for media uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MuhammadMagdyy/athar-portfolio.git
   cd athar-portfolio
   ```

2. **Backend Setup**
   ```bash
   cd backend

   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your database URL and Cloudinary credentials
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend

   # Install dependencies
   npm install
   ```

4. **Database Setup**
   ```bash
   # Make sure PostgreSQL is running
   # Create database and update DATABASE_URL in backend/.env
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload
   ```
   Backend will be available at `http://localhost:8000`

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
athar-portfolio/
├── backend/
│   ├── main.py          # FastAPI application and routes
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic schemas for API
│   ├── database.py      # Database configuration
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── api.js       # API configuration
│   ├── package.json     # Node dependencies
│   └── vite.config.js   # Vite configuration
└── README.md
```

## 🔧 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project

### Media Upload
- `POST /api/upload` - Upload media to project

## 🎨 Usage

### Viewing Projects
- Navigate to the gallery to see all projects
- Click on any project to view details and media

### Admin Panel
- Visit `/admin` to access the admin interface
- Create new projects
- Upload images/videos to projects
- Edit project names
- Delete projects and media

## 🔐 Environment Variables

Create a `.env` file in the backend directory with:

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel/Netlify)
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Update API_BASE_URL in `src/api.js` for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by creative portfolio designs
- Thanks to the open-source community</content>
<parameter name="filePath">/Users/muhammadmagdy/Desktop/Projects/Full Stack Projects/athar-portfolio/README.md