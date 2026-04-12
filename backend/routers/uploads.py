import os
import shutil
import time
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

router = APIRouter(prefix="/api/upload", tags=["Uploads"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@router.post("/")
async def upload_image(file: UploadFile = File(...), folder: str = Form("blogs")):
    # Security constraint: only allow these folders
    if folder not in ["blogs", "music_reviews", "projects"]:
        raise HTTPException(status_code=400, detail="Invalid target folder")

    # Dynamically point to the correct public folder
    UPLOAD_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "public", folder))
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Add timestamp to filename to prevent overwriting
    timestamp = int(time.time())
    unique_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"url": f"/{folder}/{unique_filename}"}