from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)

    # UPDATED: Cascade ensures photos are deleted when the project is deleted
    photos = relationship(
        "Photo", 
        back_populates="project", 
        cascade="all, delete-orphan"
    )

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    url = Column(String)
    
    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="photos")