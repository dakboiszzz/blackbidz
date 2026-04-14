from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import os
from ..security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"--- DEBUGGING LOGIN ---")
    print(f"FastAPI received this password: {form_data.password}")
    print(f"Password length: {len(form_data.password)} characters")
    print(f"FastAPI received this username: {form_data.username}")
    admin_user = os.getenv("ADMIN_USERNAME")
    admin_hash = os.getenv("ADMIN_PASSWORD_HASH")

    if form_data.username != admin_user or not verify_password(form_data.password, admin_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": admin_user})
    return {"access_token": access_token, "token_type": "bearer"}