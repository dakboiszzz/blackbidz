import re
import cloudinary.uploader

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.dependencies import get_current_admin
from backend import models, schemas
from backend.database import get_db

router = APIRouter(prefix="/api", tags=["Blog Posts"])

# --PUBLIC ENDPOINTS--

@router.get("/posts", response_model=List[schemas.PostResponse])
def get_all_posts_for_admin(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve ALL posts (published and drafts) for the admin panel."""
    return db.query(models.Post)\
             .order_by(models.Post.id.desc())\
             .offset(skip).limit(limit).all()

@router.get("/blogs", response_model=List[schemas.PostResponse])
def get_blogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve a list of all published blog posts."""
    return db.query(models.Post)\
             .filter(models.Post.is_published == True)\
             .order_by(models.Post.id.desc())\
             .offset(skip).limit(limit).all()

@router.get("/blogs/{slug}", response_model=schemas.PostResponse)
def get_blog(slug: str, db: Session = Depends(get_db)):
    """Retrieve a single blog post by its slug."""
    post = db.query(models.Post).filter(models.Post.slug == slug, models.Post.is_published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

# --ADMIN ENDPOINTS--
@router.post("/blogs", response_model=schemas.PostResponse)
def create_post(
    post: schemas.PostCreate, 
    db: Session = Depends(get_db), 
    admin: str = Depends(get_current_admin)
):
    db_post = db.query(models.Post).filter(models.Post.slug == post.slug).first()
    if db_post:
        raise HTTPException(status_code=400, detail="Slug already registered")
    
    new_post = models.Post(**post.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.put("/blogs/{post_id}", response_model=schemas.PostResponse)
def update_post(
    post_id: int, 
    post_update: schemas.PostUpdate, 
    db: Session = Depends(get_db), 
    admin: str = Depends(get_current_admin)
):
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # exclude_unset=True ensures we only update fields the frontend actually sent
    update_data = post_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_post, key, value)
        
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/blogs/{post_id}")
async def delete_post(
    post_id: int, 
    db: Session = Depends(get_db), 
    admin: str = Depends(get_current_admin)
):
    # 1. Fetch the post from the database
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # 2. The Regex Scanner: Find all Cloudinary URLs in the markdown content
    # This looks for the pattern: ![...](https://res.cloudinary.com/...)
    image_urls = re.findall(r'!\[.*?\]\((https://res\.cloudinary\.com/.*?)\)', post.content or "")
    
    # 3. Clean up the Cloudinary storage
    for url in image_urls:
        try:
            # Extract the public_id using the same logic we put in media.py
            match = re.search(r'/upload/(?:v\d+/)?(.+?)\.[a-zA-Z0-9]+$', url)
            if match:
                public_id = match.group(1)
                cloudinary.uploader.destroy(public_id)
        except Exception as e:
            print(f"Warning: Failed to delete image {url} from cloud: {e}")

    # 4. Wipe the database row
    db.delete(post)
    db.commit()

    return {"message": "Post and all embedded images deleted successfully"}