# ==============================
# 🔹 IMPORTS
# ==============================

# Core Python utilities
import os

# FastAPI core framework + tools
# Added 'Body' to imports to handle JSON payloads clearly
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Body

# Middleware for handling frontend-backend communication
from fastapi.middleware.cors import CORSMiddleware

# Database ORM tools
from sqlalchemy.orm import Session, joinedload

# Cloudinary for image upload & hosting
import cloudinary
import cloudinary.uploader

# Type hints
from typing import List

# Data validation
from pydantic import BaseModel

# Load environment variables from .env
from dotenv import load_dotenv

# Internal modules
import models, schemas, database


# ==============================
# 🔹 LOAD ENVIRONMENT VARIABLES
# ==============================
load_dotenv()


# ==============================
# 🔹 CLOUDINARY CONFIGURATION
# Securely connect to Cloudinary using env variables
# ==============================
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET") 
)


# ==============================
# 🔹 DATA SCHEMAS (Request Models)
# ==============================
class DirectUploadRequest(BaseModel):
    title: str
    url: str
    project_id: int


# ==============================
# 🔹 CREATE FASTAPI APP
# ==============================
app = FastAPI()


# ==============================
# 🔹 CORS CONFIGURATION
# Allows frontend to communicate with backend
# ==============================
origins = [
    "http://localhost:5173",             # Local dev
    "https://athar-frontend.onrender.com", # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Only allow trusted domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# 🔹 DATABASE INITIALIZATION
# Creates tables if they don’t exist
# ==============================
models.Base.metadata.create_all(bind=database.engine)


# ==============================
# 🔹 ROOT ROUTE (Health Check)
# ==============================
@app.get("/")
def home():
    return {"status": "Athar API is Live", "version": "1.0.0"}


# ==============================
# 🔹 GET ALL PROJECTS
# Returns all projects with their photos
# ==============================
@app.get("/api/projects", response_model=List[schemas.Project])
def get_projects(db: Session = Depends(database.get_db)):
    # joinedload → fetch related photos in one query (performance optimization)
    return db.query(models.Project)\
             .options(joinedload(models.Project.photos))\
             .all()


# ==============================
# 🔹 CREATE PROJECT
# ==============================
@app.post("/api/projects", response_model=schemas.Project)
def create_project(name: str = Form(...), db: Session = Depends(database.get_db)):
    # Create new project object
    db_project = models.Project(name=name)
    # Save to database
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


# ==============================
# 🔹 GET SINGLE PROJECT
# ==============================
@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def get_project_detail(project_id: int, db: Session = Depends(database.get_db)):
    # Fetch project + related photos
    project = db.query(models.Project)\
                .options(joinedload(models.Project.photos))\
                .filter(models.Project.id == project_id)\
                .first()
    # Handle not found
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ==============================
# 🔹 UPDATE PROJECT
# ==============================
@app.put("/api/projects/{project_id}", response_model=schemas.Project)
def update_project(
    project_id: int, 
    name: str = Form(...), 
    db: Session = Depends(database.get_db)
):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    # Update field
    db_project.name = name
    db.commit()
    db.refresh(db_project)
    return db_project


# ==============================
# 🔹 REGISTER UPLOAD (Modified)
# Receives Cloudinary URL from Frontend directly
# Bypasses server file handling to prevent timeouts
# ==============================

@app.post("/api/upload")
async def upload_photo(
    data: DirectUploadRequest, 
    db: Session = Depends(database.get_db)
):
    # Log the incoming data to Render logs for debugging
    print(f"DEBUG: Received sync request for Project {data.project_id} - Title: {data.title}")

    # 1. Ensure project exists
    project = db.query(models.Project).filter(models.Project.id == data.project_id).first()
    
    if not project:
        print(f"ERROR: Project {data.project_id} not found in database.")
        raise HTTPException(status_code=404, detail=f"Project {data.project_id} not found")

    try:
        # 2. Save photo record
        new_photo = models.Photo(
            title=data.title, 
            url=data.url, 
            project_id=data.project_id
        )

        db.add(new_photo)
        db.commit()
        db.refresh(new_photo)
        
        print(f"SUCCESS: Photo {new_photo.id} synced to database.")
        return new_photo

    except Exception as e:
        db.rollback()
        print(f"DATABASE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Database Error")

# ==============================
# 🔹 DELETE PROJECT
# ==============================
@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"detail": f"Project {project_id} removed."}


# ==============================
# 🔹 DELETE PHOTO
# ==============================
@app.delete("/api/photos/{photo_id}")
def delete_photo(photo_id: int, db: Session = Depends(database.get_db)):
    photo = db.query(models.Photo).filter(models.Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    db.delete(photo)
    db.commit()
    return {"detail": "Photo removed"}