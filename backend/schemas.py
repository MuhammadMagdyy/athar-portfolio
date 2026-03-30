from pydantic import BaseModel
from typing import List, Optional

# --- PHOTO SCHEMAS ---
class PhotoBase(BaseModel):
    title: str
    url: str

class Photo(PhotoBase):
    id: int
    project_id: int # Changed to required as a photo must belong to a project
    
    class Config:
        from_attributes = True

# --- PROJECT SCHEMAS ---
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    # This is exactly what the Gallery.jsx and Project.jsx need
    photos: List[Photo] = [] 
    
    class Config:
        from_attributes = True