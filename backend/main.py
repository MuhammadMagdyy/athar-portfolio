import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
import cloudinary
import cloudinary.uploader
from typing import List
from dotenv import load_dotenv

import models, schemas, database

load_dotenv()

# --- SECURE ENVIRONMENT CONFIGURATION ---
# Removed hardcoded strings to ensure your credentials stay private
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET") 
)

app = FastAPI()

# --- CORS CONFIGURATION ---
# For deployment, we will eventually replace "*" with your actual frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables
models.Base.metadata.create_all(bind=database.engine)

# --- PROJECTS ---

@app.get("/")
def home():
    return {"status": "Athar API is Live", "version": "1.0.0"}

@app.get("/api/projects", response_model=List[schemas.Project])
def get_projects(db: Session = Depends(database.get_db)):
    return db.query(models.Project).options(joinedload(models.Project.photos)).all()

@app.post("/api/projects", response_model=schemas.Project)
def create_project(name: str = Form(...), db: Session = Depends(database.get_db)):
    db_project = models.Project(name=name)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def get_project_detail(project_id: int, db: Session = Depends(database.get_db)):
    project = db.query(models.Project)\
                .options(joinedload(models.Project.photos))\
                .filter(models.Project.id == project_id)\
                .first()
                
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.put("/api/projects/{project_id}", response_model=schemas.Project)
def update_project(
    project_id: int, 
    name: str = Form(...), 
    db: Session = Depends(database.get_db)
):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_project.name = name
    db.commit()
    db.refresh(db_project)
    return db_project

# --- PHOTOS ---

@app.post("/api/upload")
async def upload_photo(
    title: str = Form(...), 
    project_id: int = Form(...), 
    file: UploadFile = File(...), 
    db: Session = Depends(database.get_db)
):
    result = cloudinary.uploader.upload(
        file.file,
        folder=f"athar/project_{project_id}",
        quality="auto",
        fetch_format="auto"
    )
    url = result.get("secure_url")
    
    new_photo = models.Photo(title=title, url=url, project_id=project_id)
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)
    return new_photo

# --- DELETE LOGIC ---

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"detail": f"Project {project_id} removed."}

@app.delete("/api/photos/{photo_id}")
def delete_photo(photo_id: int, db: Session = Depends(database.get_db)):
    photo = db.query(models.Photo).filter(models.Photo.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo removed")
    
    db.delete(photo)
    db.commit()
    return {"detail": "Photo removed"}