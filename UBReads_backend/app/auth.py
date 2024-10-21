from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import schemas, crud
from .dependencies import get_current_user, get_db
from .models import User
from .schemas import UserResponse
from .security import create_access_token, verify_password

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
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.delete("/delete-account/")
def delete_account(db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    # Get the current user from the database
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete the user from the database
    db.delete(user)
    db.commit()

    return {"message": "User account deleted successfully"}