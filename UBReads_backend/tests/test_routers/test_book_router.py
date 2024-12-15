import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.models import Base, Book
from app.core.database import get_db
from main import app

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
# single connection for entire lifecycle of tests
testing_connection = test_engine.connect()
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=testing_connection)


# Fixture to set up the database and create tables once
@pytest.fixture(scope="function", autouse=True)
def setup_test_db():
    # Use same connection for creating tables
    Base.metadata.create_all(bind=testing_connection)
    yield

    # Drop tables after the test
    Base.metadata.drop_all(bind=testing_connection)

# Fixture to override get_db and use same session
@pytest.fixture(scope="function")
def client():
    def override_get_db():
        db = TestingSessionLocal()  # Reuse same connection
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c


def test_create_book(client):
    response = client.post(
        "/books/",
        json={
            "id_book": "test_book_1",
            "title": "Test Book",
            "author": "Test Author",
            "category": "Fiction",
            "year": 2023,
            "cover_url": "http://example.com/cover.jpg"
        }
    )
    assert response.status_code == 200
    assert response.json()["id_book"] == "test_book_1"
    assert response.json()["title"] == "Test Book"
    assert response.json()["author"] == "Test Author"
    assert response.json()["category"] == "Fiction"
    assert response.json()["year"] == 2023
    assert response.json()["cover_url"] == "http://example.com/cover.jpg"


def test_read_book(client):
    # Create the book first
    response = client.post(
        "/books/",
        json={
            "id_book": "test_book_2",
            "title": "Another Test Book",
            "author": "Another Author",
            "category": "Non-Fiction",
            "year": 2024,
            "cover_url": "http://example.com/cover2.jpg"
        }
    )
    book_id = response.json()["id_book"]

    # Get book by ID
    response = client.get(f"/books/")
    for llibre in response.json():
        if llibre["id_book"] == "test_book_2":
            id = llibre["id"]

    response = client.get(f"/books/{id}")
    assert response.status_code == 200
    assert response.json()["id_book"] == "test_book_2"
    assert response.json()["title"] == "Another Test Book"
    assert response.json()["author"] == "Another Author"


def test_get_book_not_found(client):
    response = client.get("/books/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Book not found"


def test_delete_book(client):
    # Create book
    response = client.post(
        "/books/",
        json={
            "id_book": "test_book_3",
            "title": "Delete Test Book",
            "author": "Delete Author",
            "category": "Drama",
            "year": 2025,
            "cover_url": "http://example.com/delete_cover.jpg"
        }
    )
    id = 1
    
    # Delete the book
    response = client.delete(f"/books/{id}")
    assert response.status_code == 200
    assert response.json()["detail"] == "Book deleted"


    response = client.get(f"/books/{id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Book not found"

def test_delete_unexistent_book(client):
    response = client.delete("/books/3")
    assert response.status_code == 404
    assert response.json()["detail"] == "Book not found"


def test_get_books(client):
    # Create books
    client.post(
        "/books/",
        json={
            "id_book": "test_book_4",
            "title": "Book 1",
            "author": "Author 1",
            "category": "Fiction",
            "year": 2023,
            "cover_url": "http://example.com/book1_cover.jpg"
        }
    )
    client.post(
        "/books/",
        json={
            "id_book": "test_book_5",
            "title": "Book 2",
            "author": "Author 2",
            "category": "Non-Fiction",
            "year": 2024,
            "cover_url": "http://example.com/book2_cover.jpg"
        }
    )

    # Get all books
    response = client.get("/books/")
    assert response.status_code == 200
    assert len(response.json()) == 2 # Should return two books
    assert response.json()[0]["title"] == "Book 1"
    assert response.json()[1]["title"] == "Book 2"
