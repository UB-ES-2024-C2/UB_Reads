import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.models import Base, Book
from app.controllers.book_controller import BookController
from app.schemas.book import BookCreate

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
def book_controller(db_session):
    return BookController()

def test_insert_book(book_controller, db_session):
    book_create = BookCreate(
        #id_book="1",  # Asegúrate de que sea una cadena
        title="Test Book",
        author="Test Author",
        category="Fiction",
        year=2023,
        cover_url="http://example.com/cover.jpg"
    )
    book = book_controller.insert_book(db_session, book_create)
    #assert book.id_book == "1"  # Verifica que el id_book sea ahora una cadena
    assert book.title == "Test Book"
    assert book.author == "Test Author"
    assert book.category == "Fiction"
    assert book.year == 2023
    assert book.cover_url == "http://example.com/cover.jpg"

# Prueba de obtener un libro por ID
def test_get_book(book_controller, db_session):
    book_create = BookCreate(
        #id_book="1",  # Asegúrate de que sea una cadena
        title="Test Book",
        author="Test Author",
        category="Fiction",
        year=2023,
        cover_url="http://example.com/cover.jpg"
    )
    book_controller.insert_book(db_session, book_create)
    book = book_controller.get_book(db_session, "1")  # Usa una cadena para el ID
    #assert book.id_book == "1"
    assert book.title == "Test Book"
    assert book.author == "Test Author"

def test_get_book_not_found(book_controller, db_session):
    non_existing_book = book_controller.get_book(db_session, 999)
    assert non_existing_book is None

# Prueba de eliminar un libro
def test_delete_book(book_controller, db_session):
    book_create = BookCreate(
        id_book="1",  # Asegúrate de que sea una cadena
        title="Test Book",
        author="Test Author",
        category="Fiction",
        year=2023,
        cover_url="http://example.com/cover.jpg"
    )
    book = book_controller.insert_book(db_session, book_create)
    result = book_controller.delete_book(db_session, "1")  # Usa una cadena para el ID
    assert result is True
    assert book_controller.get_book(db_session, "1") is None

def test_delete_book_not_found(book_controller, db_session):
    result = book_controller.delete_book(db_session, 999)
    assert result is False

# Prueba de obtener todos los libros
def test_get_books(book_controller, db_session):
    book_create1 = BookCreate(
        id_book="1",  # Asegúrate de que sea una cadena
        title="Test Book 1",
        author="Test Author 1",
        category="Fiction",
        year=2023,
        cover_url="http://example.com/cover1.jpg"
    )
    book_create2 = BookCreate(
        id_book="2",  # Asegúrate de que sea una cadena
        title="Test Book 2",
        author="Test Author 2",
        category="Non-Fiction",
        year=2024,
        cover_url="http://example.com/cover2.jpg"
    )
    book_controller.insert_book(db_session, book_create1)
    book_controller.insert_book(db_session, book_create2)

    books = book_controller.get_books(db_session)
    assert len(books) == 2
    assert books[0].title == "Test Book 1"
    assert books[1].title == "Test Book 2"
