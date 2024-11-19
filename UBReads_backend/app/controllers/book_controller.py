
import requests
from sqlalchemy.orm import Session
from app.core.models import Book
from app.schemas.book import BookCreate


class BookController:

    @staticmethod
    def insert_book(db: Session, book_create: BookCreate):
        db_book = Book(
            title=book_create.title,
            author=book_create.author,
            category=book_create.category,
            year=book_create.year,
            cover_url=book_create.cover_url
        )
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book

    @staticmethod
    def get_book(db: Session, book_id: int):
        return db.query(Book).filter(Book.id == book_id).first()

    @staticmethod
    def delete_book(db: Session, book_id: int):
        book = db.query(Book).filter(Book.id == book_id).first()
        if book:
            db.delete(book)
            db.commit()
            return True
        return False

    @staticmethod
    def get_books(db: Session):
        return db.query(Book).all()
