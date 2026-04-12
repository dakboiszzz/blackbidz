import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables from a .env file (for local development)
load_dotenv()

# Securely fetch the database URL from the environment
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("No DATABASE_URL set. Please check your environment variables.")

# Cloud providers sometimes issue URLs starting with "postgres://", 
# but modern SQLAlchemy requires "postgresql://". This safely handles both.
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Notice we removed connect_args={"check_same_thread": False} 
# PostgreSQL handles connections differently than SQLite.
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to safely handle database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()