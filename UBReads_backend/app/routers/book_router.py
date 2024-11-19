
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.book_controller import BookController
from app.schemas.book import BookCreate, Book, BookUpdate
from typing import List

router = APIRouter()


@router.post("/books/", response_model=Book)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    db_book = BookController.insert_book(db=db, book_create=book)
    return db_book


@router.get("/books/{book_id}", response_model=Book)
def book_info(book_id: int, db: Session = Depends(get_db)):
    db_book = BookController.get_book(db, book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


@router.delete("/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    if not BookController.delete_book(db, book_id):
        raise HTTPException(status_code=404, detail="Book not found")
    return {"detail": "Book deleted"}


@router.get("/books/", response_model=List[Book])
def saved_books(db: Session = Depends(get_db)):
    return BookController.get_books(db)
