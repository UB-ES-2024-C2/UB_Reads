from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.user_controller import UserController
from app.schemas.user import UserCreate, User
from app.schemas.token import TokenData
import jwt
import os
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
)
from jose import JWTError
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(
    security_scopes: SecurityScopes,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    authenticate_value = (
        f'Bearer scope="{security_scopes.scope_str}"'
        if security_scopes.scopes
        else "Bearer"
    )
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )

    try:
        print(f"Decoding token with SECRET_KEY: {SECRET_KEY} and ALGORITHM: {ALGORITHM}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded JWT Payload: {payload}")  # Depuración
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(scopes=payload.get("scopes", []), username=username)
    except JWTError as e:
        print(f"JWT Error: {str(e)}")  # Depuración
        raise credentials_exception

    user = UserController.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception

    return user


@router.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return UserController.insert_user(
            db=db, username=user.username, email=user.email, password=user.password
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = UserController.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.delete("/users-delete/", response_model=dict)
def delete_user(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    if not UserController.delete_user(db=db, user=current_user):
        raise HTTPException(status_code=404, detail="User not found")

    return {"detail": "User deleted successfully"}


@router.get("/users/", response_model=list[User])
def read_users(db: Session = Depends(get_db)):
    return UserController.get_users(db=db)


@router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    # Esto devolverá el usuario autenticado al frontend
    return current_user


@router.post("/token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = UserController.get_user_by_username(db=db, username=form_data.username)
    if not user or not UserController.verify_password(
        form_data.password, user.password
    ):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = UserController.create_access_token(data={"sub": user.username})
    refresh_token = UserController.create_refresh_token(data={"sub": user.username})

    user.refresh_token = refresh_token
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


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


from app.controllers.user_controller import UserController

@router.post("/{user_id}/follow/{to_follow_id}")
def follow_user_with_id(user_id: int, to_follow_id: int, db: Session = Depends(get_db)):
    try:
        UserController.follow_user_with_id(db, user_id, to_follow_id)
        return {"message": f"User {user_id} is now following {to_follow_id}"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/users/{username}/follow/{to_follow_username}")
def follow_user_with_username(
    username: str, to_follow_username: str, db: Session = Depends(get_db)
):
    try:
        UserController.follow_user_with_username(db, username, to_follow_username)
        return {"message": f"{username} is now following {to_follow_username}"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}/followers")
def get_followers(user_id: int, db: Session = Depends(get_db)):
    try:
        followers = UserController.get_followers(db, user_id)
        return {
            "followers": [
                {"id": follower.id, "username": follower.username, "email": follower.email}
                for follower in followers
            ]
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{user_id}/following")
def get_following(user_id: int, db: Session = Depends(get_db)):
    try:
        following = UserController.get_following(db, user_id)
        return {
            "following": [
                {"id": user.id, "username": user.username, "email": user.email}
                for user in following
            ]
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{user_id}/unfollow/{to_unfollow_id}")
def unfollow_user(user_id: int, to_unfollow_id: int, db: Session = Depends(get_db)):
    try:
        UserController.unfollow_user(db, user_id, to_unfollow_id)
        return {"message": f"User {user_id} has unfollowed {to_unfollow_id}"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

