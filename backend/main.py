from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our database engine and the Base classes
from backend.database import engine
import backend.models as models

# Import your newly created routers
from backend.routers import blogs, music_reviews, uploads

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

# --- Include Routers ---
app.include_router(uploads.router)
app.include_router(blogs.router)
app.include_router(music_reviews.router)

# --- Root & Health Endpoints ---
@app.get("/api/health")
async def health_check():
    return {"status": "online"}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Blog API! The API is running."}