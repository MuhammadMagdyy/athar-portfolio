# ==============================
# 🔹 IMPORTS
# ==============================

# SQLAlchemy core tools for defining database tables
from sqlalchemy import Column, Integer, String, ForeignKey

# ORM relationship handling (linking tables together)
from sqlalchemy.orm import relationship

# Base class for all models (from database.py)
from database import Base


# ==============================
# 🔹 PROJECT MODEL (TABLE)
# Represents a project in the database
# ==============================
class Project(Base):

    # Table name in the database
    __tablename__ = "projects"

    # ==============================
    # 🔹 COLUMNS
    # ==============================

    # Primary key (unique ID)
    id = Column(Integer, primary_key=True, index=True)

    # Project name (must be unique)
    name = Column(String, unique=True, index=True)

    # Optional description
    description = Column(String, nullable=True)


    # ==============================
    # 🔹 RELATIONSHIP
    # One project → many photos
    # ==============================

    photos = relationship(
        "Photo",                 # Related model
        back_populates="project", # Connects to Photo.project
        cascade="all, delete-orphan" # Delete photos when project is deleted
    )


# ==============================
# 🔹 PHOTO MODEL (TABLE)
# Represents an image belonging to a project
# ==============================
class Photo(Base):

    # Table name
    __tablename__ = "photos"

    # ==============================
    # 🔹 COLUMNS
    # ==============================

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Photo title
    title = Column(String)

    # Image URL (from Cloudinary)
    url = Column(String)
    

    # ==============================
    # 🔹 FOREIGN KEY (RELATIONSHIP)
    # ==============================

    # Links photo → project
    project_id = Column(Integer, ForeignKey("projects.id"))

    # Relationship back to Project
    project = relationship("Project", back_populates="photos")