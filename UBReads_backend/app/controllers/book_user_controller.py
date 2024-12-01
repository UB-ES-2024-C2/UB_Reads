from sqlalchemy.orm import Session
from app.core.models import book_users, User, Book
from fastapi import HTTPException
from sqlalchemy import update, select, and_


class BookUserController:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def insert_book_user(db: Session, user_id: int, book_id: int):
        stmt = book_users.insert().values(
            user_id=user_id, book_id=book_id, is_read=False, rating=None, comment=None
        )  # Por defecto, no leído
        db.execute(stmt)
        db.commit()

    @staticmethod
    def get_books_by_user(db: Session, user_id: int):
        return (
            db.query(Book, book_users.c.is_read)
            .join(book_users)
            .filter(book_users.c.user_id == user_id)
            .all()
        )

    @staticmethod
    def get_users_by_book(db: Session, book_id: int):
        return (
            db.query(User)
            .join(book_users)
            .filter(book_users.c.book_id == book_id)
            .all()
        )

    @staticmethod
    def delete_book_user(db: Session, user_id: int, book_id: int):
        stmt = book_users.delete().where(
            book_users.c.user_id == user_id, book_users.c.book_id == book_id
        )
        db.execute(stmt)
        db.commit()

    @staticmethod
    def update_read_status(db: Session, user_id: int, book_id: int, is_read: bool):
        user_book_record = (
            db.query(book_users)
            .filter(book_users.c.user_id == user_id, book_users.c.book_id == book_id)
            .first()
        )

        if not user_book_record:
            raise HTTPException(status_code=404, detail="Book or User not found")

        db.execute(
            update(book_users)
            .where(book_users.c.user_id == user_id, book_users.c.book_id == book_id)
            .values(is_read=is_read)
        )
        db.commit()

        updated_book = db.query(Book).filter(Book.id == book_id).first()
        if not updated_book:
            raise HTTPException(status_code=404, detail="Book not found")

        return {"book": updated_book, "is_read": is_read}
    
    @staticmethod
    def update_user_comment_and_rating( 
        db: Session, user_id: int, book_id: int, rating: int, comment: str
    ):
        db.execute(
            update(book_users)
            .where(book_users.c.user_id == user_id, book_users.c.book_id == book_id)
            .values(rating=rating, comment=comment)
        )
        db.commit()

    @staticmethod
    def get_user_comment_and_rating_for_book(db: Session, user_id: int, book_id: int):
        stmt = select(
            book_users.c.rating, 
            book_users.c.comment
        ).where(
            and_(
                book_users.c.user_id == user_id,
                book_users.c.book_id == book_id
            )
        )
        result = db.execute(stmt
        ).first()
        return result