# ==============================
# 🔹 IMPORTS
# ==============================

import os

# SQLAlchemy engine (connects to DB)
from sqlalchemy import create_engine

# Base class for models
from sqlalchemy.ext.declarative import declarative_base

# Session management (DB transactions)
from sqlalchemy.orm import sessionmaker

# Load environment variables
from dotenv import load_dotenv


# ==============================
# 🔹 LOAD ENV VARIABLES
# ==============================
load_dotenv()


# ==============================
# 🔹 DATABASE URL CONFIGURATION
# ==============================

# Get database URL from environment (Render / Railway / local)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Fix for postgres:// vs postgresql:// issue
# Some platforms use "postgres://" but SQLAlchemy needs "postgresql://"
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace(
        "postgres://", "postgresql://", 1
    )


# ==============================
# 🔹 CREATE DATABASE ENGINE
# ==============================

# Engine = connection to database
engine = create_engine(SQLALCHEMY_DATABASE_URL)


# ==============================
# 🔹 SESSION FACTORY
# ==============================

# Session = temporary connection used for queries
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ==============================
# 🔹 BASE CLASS FOR MODELS
# ==============================

Base = declarative_base()


# ==============================
# 🔹 DATABASE DEPENDENCY
# Used in FastAPI endpoints
# ==============================
def get_db():
    db = SessionLocal()  # create new DB session
    try:
        yield db         # give session to endpoint
    finally:
        db.close()       # always close after request