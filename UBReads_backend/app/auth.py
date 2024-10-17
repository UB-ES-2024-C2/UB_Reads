from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import schemas, models, crud
from .dependencies import get_db
from .schemas import UserResponse
from .security import verify_password, create_access_token, get_current_user
from datetime import timedelta

router = APIRouter()

@router.post("/signup/")
def sign_up(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = crud.hash_password(user.password)
    new_user = crud.create_user(db, user, hashed_password)
    return {"message": "User created successfully"}

@router.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=30) # TODO 30 => ACCESS_TOKEN_EXPIRE_MINUTES
    access_token = create_access_token(data={"sub": db_user.email}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: schemas.UserResponse = Depends(get_current_user)):
    return current_user