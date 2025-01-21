import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.models import Base
from app.controllers.book_controller import BookController
from app.schemas.book import BookCreate

# Setup test database
SQL_TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(SQL_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Pytest fixtures
@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=test_engine)
    session = TestSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="function")
def book_controller():
    return BookController()

# Performance Test 1: Book Creation
def test_performance_insert_book(benchmark, book_controller, db_session):
    def create_book():
        book_create = BookCreate(
            id_book="1",
            title="Performance Test Book",
            author="Author",
            category="Category",
            year=2024,
            cover_url="http://example.com/cover.jpg"
        )
        book_controller.insert_book(db_session, book_create)

    benchmark(create_book)

# Performance Test 2: Get Book by ID
def test_performance_get_book(benchmark, book_controller, db_session):
    # Pre-insert a book
    book_create = BookCreate(
        id_book="1",
        title="Get Book Test",
        author="Author",
        category="Category",
        year=2024,
        cover_url="http://example.com/cover.jpg"
    )
    inserted_book = book_controller.insert_book(db_session, book_create)

    def get_book():
        book_controller.get_book(db_session, inserted_book.id)

    benchmark(get_book)

# Performance Test 3: Get All Books
def test_performance_get_books(benchmark, book_controller, db_session):
    # Pre-insert multiple books
    for i in range(100):
        book_create = BookCreate(
            id_book=str(i),
            title=f"Book {i}",
            author="Author",
            category="Category",
            year=2024,
            cover_url=f"http://example.com/cover_{i}.jpg"
        )
        book_controller.insert_book(db_session, book_create)

    def get_books():
        book_controller.get_books(db_session)

    benchmark(get_books)

# Performance Test 4: Delete Book
def test_performance_delete_book(benchmark, book_controller, db_session):
    # Pre-insert a book
    book_create = BookCreate(
        id_book="1",
        title="Delete Test Book",
        author="Author",
        category="Category",
        year=2024,
        cover_url="http://example.com/cover.jpg"
    )
    inserted_book = book_controller.insert_book(db_session, book_create)

    def delete_book():
        book_controller.delete_book(db_session, inserted_book.id)

    benchmark(delete_book)
