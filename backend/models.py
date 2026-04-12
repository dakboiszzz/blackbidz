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