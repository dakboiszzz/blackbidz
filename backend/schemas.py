from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# Shared properties for a Post
class PostBase(BaseModel):
    title: str
    slug: str
    summary: Optional[str] = None
    content: Optional[str] = None
    is_published: bool = False

# Properties required when creating a Post 
# (Included for completeness and future admin panel)
class PostCreate(PostBase):
    pass

# Properties returning from the API 
class PostResponse(PostBase):
    id: int
    created_at: datetime

    # Tell Pydantic how to read the SQLAlchemy Post model
    model_config = ConfigDict(from_attributes=True)

# A base class for fields that will be present in all models
class MusicReviewBase(BaseModel):
    title: str
    image_url: str
    summary: str
    # Keywords are tricky in simple SQLite setups.
    # The best approach for now is to store them as a special-character-delimited string (e.g., using '::').
    # e.g., "Khá hợp khi yêu đương::Hợp khi yêu đời::Vui vẻ phấn chấn"
    keywords: str

# Model used for creation (input) - needs the full text content
class MusicReviewCreate(MusicReviewBase):
    full_content: str

# Model used for reading (output) - has the unique ID
class MusicReview(MusicReviewBase):
    id: int
    # Tell Pydantic how to read the SQLAlchemy model
    model_config = ConfigDict(from_attributes=True)