from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func

from backend.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    summary = Column(String)
    content = Column(String)  # This can store Markdown or simple HTML
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MusicReview(Base):
    __tablename__ = "music_reviews"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    image_url = Column(String)
    summary = Column(Text)
    full_content = Column(Text)
    # Stored as a special-character-delimited string (e.g., "Keyword 1::Keyword 2")
    keywords = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
# Replace your existing Diary class in models.py with this:
class Diary(Base):
    __tablename__ = "diaries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)  # Added slug
    summary = Column(String)                        # Added summary
    content = Column(String)                        # Changed from Text to String to match Post
    is_published = Column(Boolean, default=False)   # Added is_published (Vault Draft vs Vault Final)
    created_at = Column(DateTime(timezone=True), server_default=func.now())