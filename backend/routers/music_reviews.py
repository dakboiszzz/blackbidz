from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend import models, schemas
from backend.database import get_db

router = APIRouter(prefix="/api/music_reviews", tags=["Music Evaluations"])

@router.get("/", response_model=List[schemas.MusicReview])
def get_music_reviews(db: Session = Depends(get_db)):
    return db.query(models.MusicReview).order_by(models.MusicReview.id.desc()).all()

@router.post("", response_model=schemas.MusicReview)
def create_music_review(review: schemas.MusicReviewCreate, db: Session = Depends(get_db)):
    new_review = models.MusicReview(**review.model_dump())
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review