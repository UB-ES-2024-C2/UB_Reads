from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .dependencies import get_db, get_current_user
from .models import Book, User
from .schemas import BookCreate, BookResponse

router = APIRouter()

@router.post("/", response_model=BookResponse)
def add_book(book: BookCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if the book already exists
    db_book = db.query(Book).filter(Book.title == book.title, Book.author == book.author).first()
    
    if not db_book:
        # If the book doesn't exist, create it
        db_book = Book(title=book.title, author=book.author)
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
    
    # Check if the user already has this book
    if db_book in current_user.books:
        raise HTTPException(status_code=400, detail="Book already in user's collection")
    
    # Add the book to the current user's collection (many-to-many)
    current_user.books.append(db_book)
    db.commit()

    return db_book

@router.get("/", response_model=List[BookResponse])
def get_books(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return current_user.books