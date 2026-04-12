from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend import models, schemas
from backend.database import get_db

router = APIRouter(prefix="/api", tags=["Blog Posts"])

@router.post("/posts", response_model=schemas.PostResponse)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    db_post = db.query(models.Post).filter(models.Post.slug == post.slug).first()
    if db_post:
        raise HTTPException(status_code=400, detail="Slug already registered")
    
    new_post = models.Post(**post.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.get("/blogs", response_model=List[schemas.PostResponse])
def get_blogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve a list of all published blog posts."""
    return db.query(models.Post).filter(models.Post.is_published == True).offset(skip).limit(limit).all()

@router.get("/blogs/{slug}", response_model=schemas.PostResponse)
def get_blog(slug: str, db: Session = Depends(get_db)):
    """Retrieve a single blog post by its slug."""
    post = db.query(models.Post).filter(models.Post.slug == slug, models.Post.is_published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post