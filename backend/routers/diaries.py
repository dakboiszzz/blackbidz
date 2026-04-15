from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, database
from ..dependencies import get_current_admin

router = APIRouter(prefix="/api/diaries", tags=["diaries"])

# GET ALL - Only admin can see the list
@router.get("/", response_model=List[schemas.DiaryResponse])
async def get_diaries(
    db: Session = Depends(database.get_db),
    admin: str = Depends(get_current_admin)
):
    return db.query(models.Diary).order_by(models.Diary.created_at.desc()).all()

# GET ONE BY SLUG - Only admin can read the entry
@router.get("/{slug}", response_model=schemas.DiaryResponse)
async def get_diary_by_slug(
    slug: str, 
    db: Session = Depends(database.get_db),
    admin: str = Depends(get_current_admin)
):
    diary = db.query(models.Diary).filter(models.Diary.slug == slug).first()
    if not diary:
        raise HTTPException(status_code=404, detail="Diary entry not found")
    return diary

# CREATE NEW DIARY
@router.post("/", response_model=schemas.DiaryResponse)
async def create_diary(
    diary: schemas.DiaryCreate, 
    db: Session = Depends(database.get_db),
    admin: str = Depends(get_current_admin)
):
    db_diary = models.Diary(**diary.model_dump())
    db.add(db_diary)
    db.commit()
    db.refresh(db_diary)
    return db_diary

# UPDATE EXISTING DIARY
@router.put("/{diary_id}", response_model=schemas.DiaryResponse)
async def update_diary(
    diary_id: int, 
    diary_update: schemas.DiaryCreate, 
    db: Session = Depends(database.get_db),
    admin: str = Depends(get_current_admin)
):
    db_diary = db.query(models.Diary).filter(models.Diary.id == diary_id).first()
    if not db_diary:
        raise HTTPException(status_code=404, detail="Diary entry not found")
    
    for key, value in diary_update.model_dump().items():
        setattr(db_diary, key, value)
        
    db.commit()
    db.refresh(db_diary)
    return db_diary

# DELETE DIARY
@router.delete("/{diary_id}")
async def delete_diary(
    diary_id: int, 
    db: Session = Depends(database.get_db),
    admin: str = Depends(get_current_admin)
):
    db_diary = db.query(models.Diary).filter(models.Diary.id == diary_id).first()
    if not db_diary:
        raise HTTPException(status_code=404, detail="Diary entry not found")
    
    db.delete(db_diary)
    db.commit()
    return {"message": "Diary entry deleted successfully"}