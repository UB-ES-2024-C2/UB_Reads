from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.user_controller import UserController
from app.schemas.user import UserCreate, User
from app.schemas.token import TokenData
import jwt, os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, SecurityScopes
from typing import Annotated
from pydantic import ValidationError
from jwt.exceptions import InvalidTokenError
from jose import JWTError

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(
    security_scopes: SecurityScopes,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope.str}"'
    else:
        authenticate_value = "Bearer"

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception

        token_scopes = payload.get("scopes", [])
        token_data = TokenData(scopes=token_scopes, username=username)
    except (JWTError, ValidationError):
        raise credentials_exception

    user = UserController.get_user_by_username(db, username=token_data.username)
    if user is None:
        print(f"Usuario no encontrado: {token_data.username}")
        raise credentials_exception

    # Validar los scopes requeridos
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions"
            )

    return user

@router.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return UserController.insert_user(db=db, username=user.username, email=user.email, password=user.password)

@router.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = UserController.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/users-delete/", response_model=dict)
def delete_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not UserController.delete_user(db=db, user=current_user):
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"detail": "User deleted successfully"}

@router.get("/users/", response_model=list[User])
def read_users(db: Session = Depends(get_db)):
    return UserController.get_users(db=db)


@router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return current_user


@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = UserController.get_user_by_username(db=db, username=form_data.username)
    if not user or not UserController.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = UserController.create_access_token(data={"sub": user.username})
    refresh_token = UserController.create_refresh_token(data={"sub": user.username})

    user.refresh_token = refresh_token
    db.commit()
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/token/refresh")
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try: 
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        
        if not username:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user = UserController.get_user_by_username(db=db, username=username)

        if user is None or user.refresh_token != refresh_token:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = UserController.create_access_token(data={"sub": username})
    return {"access_token": new_access_token, "token_type": "bearer"}
