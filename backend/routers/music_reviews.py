import re
import cloudinary.uploader
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend import models, schemas
from backend.database import get_db

router = APIRouter(prefix="/api/music_reviews", tags=["Music Evaluations"])

@router.get("", response_model=List[schemas.MusicReview])
def get_music_reviews(db: Session = Depends(get_db)):
    return db.query(models.MusicReview).order_by(models.MusicReview.id.desc()).all()

@router.post("", response_model=schemas.MusicReview)
def create_music_review(review: schemas.MusicReviewCreate, db: Session = Depends(get_db)):
    new_review = models.MusicReview(**review.model_dump())
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

@router.put("/{review_id}", response_model=schemas.MusicReview)
def update_music_review(review_id: int, review_update: schemas.MusicReviewUpdate, db: Session = Depends(get_db)):
    db_review = db.query(models.MusicReview).filter(models.MusicReview.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Update only the fields that were provided
    update_data = review_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_review, key, value)
        
    db.commit()
    db.refresh(db_review)
    return db_review

@router.delete("/{review_id}")
async def delete_music_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(models.MusicReview).filter(models.MusicReview.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")

    # 1. Clean up the Cloudinary storage using the dedicated image_url column
    try:
        if db_review.image_url:
            match = re.search(r'/upload/(?:v\d+/)?(.+?)\.[a-zA-Z0-9]+$', db_review.image_url)
            if match:
                public_id = match.group(1)
                cloudinary.uploader.destroy(public_id)
    except Exception as e:
        print(f"Warning: Failed to delete image {db_review.image_url} from cloud: {e}")

    # 2. Wipe the database row
    db.delete(db_review)
    db.commit()
    return {"message": "Review and album cover deleted successfully"}