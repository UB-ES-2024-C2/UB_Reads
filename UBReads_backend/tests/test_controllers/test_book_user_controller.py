import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.models import Base, User, Book, book_users
from app.controllers.book_user_controller import BookUserController
from app.schemas.user import UserCreate
from app.schemas.book import BookCreate
from fastapi import HTTPException

SQL_TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(SQL_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=test_engine)
    session = TestSessionLocal()
    yield session 
    session.close() 
    Base.metadata.drop_all(bind=test_engine)  

@pytest.fixture(scope="function")
def book_user_controller(db_session): 
    
    return BookUserController(db_session)

@pytest.fixture
def user_and_book(db_session: Session):
    
    user_create = UserCreate(
        username="test_user", 
        email="test_user@example.com", 
        password="test_password", 
        profile_pic="profile_pic"
    )
    user = User(**user_create.dict())
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    book_create = BookCreate(
        id_book="1", title="Test Book", author="Test Author", category="Fiction", year=2023, cover_url="http://example.com/cover.jpg"
    )
    book = Book(**book_create.dict())
    db_session.add(book)
    db_session.commit()
    db_session.refresh(book)

    return user, book


def test_insert_book_user(user_and_book, db_session):
    user, book = user_and_book
    book_user_controller = BookUserController(db_session)
    
    book_user_controller.insert_book_user(db_session, user.id, book.id)
    
    result = db_session.query(book_users).filter(book_users.c.user_id == user.id, book_users.c.book_id == book.id).first()
    assert result is not None
    assert result.user_id == user.id
    assert result.book_id == book.id
    assert result.is_read == False  

def test_get_books_by_user(user_and_book, db_session):
    user, book = user_and_book
    book_user_controller = BookUserController(db_session)
    
    book_user_controller.insert_book_user(db_session, user.id, book.id)
    
    books = book_user_controller.get_books_by_user(db_session, user.id)
    
    assert len(books) > 0
    assert books[0][0].id == book.id
    assert books[0][1] == False  

def test_get_users_by_book(user_and_book, db_session):
    user, book = user_and_book
    book_user_controller = BookUserController(db_session)
    
    book_user_controller.insert_book_user(db_session, user.id, book.id)
    
    users = book_user_controller.get_users_by_book(db_session, book.id)
    
    assert len(users) > 0
    assert users[0].id == user.id

def test_delete_book_user(user_and_book, db_session):
    user, book = user_and_book
    book_user_controller = BookUserController(db_session)
    
    book_user_controller.insert_book_user(db_session, user.id, book.id)
    
    book_user_controller.delete_book_user(db_session, user.id, book.id)
    
    result = db_session.query(book_users).filter(book_users.c.user_id == user.id, book_users.c.book_id == book.id).first()
    assert result is None

def test_update_read_status(user_and_book, db_session):
    user, book = user_and_book
    book_user_controller = BookUserController(db_session)
    
    book_user_controller.insert_book_user(db_session, user.id, book.id)
    
    result = book_user_controller.update_read_status(db_session, user.id, book.id, True)
    
    assert result["is_read"] == True
    
    updated_record = db_session.query(book_users).filter(book_users.c.user_id == user.id, book_users.c.book_id == book.id).first()
    assert updated_record.is_read == True

def test_update_read_status_not_found(db_session):
    book_user_controller = BookUserController(db_session)
    
    with pytest.raises(HTTPException):
        book_user_controller.update_read_status(db_session, 999, 999, True)