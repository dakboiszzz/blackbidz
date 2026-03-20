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
