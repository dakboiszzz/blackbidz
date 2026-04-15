import os
import re
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv

from backend.dependencies import get_current_admin

# Load environment variables so Cloudinary can find CLOUDINARY_URL
load_dotenv()

# Forces Cloudinary to always return secure 'https://' URLs
cloudinary.config(secure=True) 

# Renamed prefix from /upload to /media
router = APIRouter(prefix="/api/media", tags=["Media"])

class DeleteMediaRequest(BaseModel):
    url: str

@router.post("")
async def upload_image(
    file: UploadFile = File(...), 
    folder: str = Form(...), 
    admin: str = Depends(get_current_admin)
):
    # 1. Security constraint: only allow your specified frontend folders
    valid_folders = ["blogs", "music_reviews", "projects", "diaries"]
    if folder not in valid_folders:
        raise HTTPException(status_code=400, detail="Invalid target folder")

    try:
        contents = await file.read()
        cloudinary_folder = f"blackbidz/{folder}"
        
        result = cloudinary.uploader.upload(
            contents, 
            folder=cloudinary_folder,
            resource_type="auto" 
        )
        
        return {"url": result.get("secure_url")}
        
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload image to the cloud.")


@router.delete("")
async def delete_image(
    request: DeleteMediaRequest,
    admin: str = Depends(get_current_admin)
):
    try:
        # 1. Extract the public_id using RegEx
        # Matches everything after '/upload/' (ignoring the optional version like v123456/) 
        # up until the file extension (.jpg, .png)
        match = re.search(r'/upload/(?:v\d+/)?(.+?)\.[a-zA-Z0-9]+$', request.url)
        
        if not match:
            raise HTTPException(status_code=400, detail="Could not parse Cloudinary URL")
            
        public_id = match.group(1)
        
        # 2. Tell Cloudinary to destroy the asset
        result = cloudinary.uploader.destroy(public_id)
        
        # Cloudinary returns 'ok' if deleted, or 'not found' if it was already gone
        if result.get("result") == "ok":
            return {"message": "Image successfully deleted from cloud storage"}
        else:
            return {"message": f"Cloudinary response: {result.get('result')}"}
            
    except Exception as e:
        print(f"Cloudinary deletion failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete image from the cloud.")