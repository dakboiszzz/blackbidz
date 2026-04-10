from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our database engine and the Base classes
from backend.database import engine, get_db
from sqlalchemy.orm import Session
from typing import List
from fastapi import Depends, HTTPException
import backend.schemas as schemas
import backend.models as models

# This safely creates any missing tables if they don't exist yet
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blog API",
    description="Backend for the vintage-inspired blog."
)



# --- CORS Configuration ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://blackbidz.com",
    "https://www.blackbidz.com",
    "*"  # Allows HuggingFace Spaces iframe embedding or wildcard requests if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/posts/", response_model=schemas.PostResponse)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    # Check if a post with the same slug already exists
    db_post = db.query(models.Post).filter(models.Post.slug == post.slug).first()
    if db_post:
        raise HTTPException(status_code=400, detail="Slug already registered")
    
    # Create the new post
    new_post = models.Post(**post.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@app.get("/")
def read_root():
    return {"message": "Welcome to the Blog API! The API is running."}

@app.get("/api/blogs", response_model=List[schemas.PostResponse])
def get_blogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of all published blog posts.
    """
    posts = db.query(models.Post).filter(models.Post.is_published == True).offset(skip).limit(limit).all()
    return posts

@app.get("/api/blogs/{slug}", response_model=schemas.PostResponse)
def get_blog(slug: str, db: Session = Depends(get_db)):
    """
    Retrieve a single blog post by its slug.
    """
    post = db.query(models.Post).filter(models.Post.slug == slug, models.Post.is_published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post
