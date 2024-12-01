from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.book_user_controller import BookUserController
from app.schemas.user import User
from app.schemas.book import Book
from app.schemas.user_book import UserBookUpdate, UserBook
from app.schemas.user_book_read import UserBookResponse

router = APIRouter()


@router.post("/users/{user_id}/books/{book_id}")
def add_book_to_user(user_id: int, book_id: int, db: Session = Depends(get_db)):
    BookUserController.insert_book_user(db=db, user_id=user_id, book_id=book_id)
    return {"detail": "Book added to user"}


@router.get("/users/{user_id}/books/", response_model=list[UserBookResponse])
def get_books_by_user(user_id: int, db: Session = Depends(get_db)):
    user_books = BookUserController.get_books_by_user(db=db, user_id=user_id)

    response = []
    for book, is_read in user_books:
        is_read_value = is_read if is_read is not None else False
        response.append(UserBookResponse(book=book, is_read=is_read_value))

    return response


@router.get("/books/{book_id}/users/", response_model=list[User])
def get_users_by_book(book_id: int, db: Session = Depends(get_db)):
    return BookUserController.get_users_by_book(db=db, book_id=book_id)


@router.delete("/users/{user_id}/books/{book_id}")
def remove_book_from_user(user_id: int, book_id: int, db: Session = Depends(get_db)):
    BookUserController.delete_book_user(db=db, user_id=user_id, book_id=book_id)
    return {"detail": "Book removed from user"}

@router.patch("/users/{user_id}/books/{book_id}/read-status")
def update_book_read_status(
    user_id: int,
    book_id: int,
    status: UserBookUpdate,
    db: Session = Depends(get_db),
):
    try:
        result = BookUserController.update_read_status(
            db=db, user_id=user_id, book_id=book_id, is_read=status.is_read
        )
        return {"detail": "Read status updated", "data": result}
    except HTTPException as e:
        raise e