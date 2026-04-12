import os
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from dotenv import load_dotenv

# Load environment variables so Cloudinary can find CLOUDINARY_URL
load_dotenv()

# Forces Cloudinary to always return secure 'https://' URLs
cloudinary.config(secure=True) 

router = APIRouter(prefix="/api/upload", tags=["Uploads"])

@router.post("")
async def upload_image(file: UploadFile = File(...), folder: str = Form("blogs")):
    # 1. Security constraint: only allow your specified frontend folders
    valid_folders = ["blogs", "music_reviews", "projects"]
    if folder not in valid_folders:
        raise HTTPException(status_code=400, detail="Invalid target folder")

    try:
        # 2. Read the file completely into memory (no local saving needed)
        contents = await file.read()
        
        # 3. Upload to Cloudinary
        # We prefix the folder with 'blackbidz/' to keep your cloud dashboard organized
        cloudinary_folder = f"blackbidz/{folder}"
        
        result = cloudinary.uploader.upload(
            contents, 
            folder=cloudinary_folder,
            resource_type="auto" # Safely handles jpg, png, webp, and gifs
        )
        
        # 4. Return the exact JSON structure your React frontend already expects
        return {"url": result.get("secure_url")}
        
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload image to the cloud.")