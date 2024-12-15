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

def test_add_book_to_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123"
        },
    )
    assert response.status_code == 200
    
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

    response = client.post(f"/users/1/books/1")
    assert response.status_code == 200
    assert response.json() == {"detail": "Book added to user"}


def test_get_books_by_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123"
        },
    )
    assert response.status_code == 200
    response = client.get(f"/users/1/books/")
    assert response.status_code == 200
    assert len(response.json()) == 0

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

    response = client.post(f"/users/1/books/1")
    response = client.get(f"/users/1/books/")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["book"]["id_book"] == "test_book_1"
    assert response.json()[0]["book"]["title"] == "Test Book"
    assert response.json()[0]["book"]["author"] == "Test Author"
    

def test_get_users_by_book(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123"
        },
    )

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
    response = client.get(f"/books/1/users/")

    assert response.status_code == 200
    assert len(response.json()) == 0

    response = client.post(f"/users/1/books/1")

    response = client.get(f"/books/1/users/")

    assert response.status_code == 200
    assert len(response.json()) == 1

    assert response.json()[0]["id"] == 1
    assert response.json()[0]["username"] == "testuser"
    assert response.json()[0]["email"] == "testuser@example.com"

def test_remove_book_from_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123"
        },
    )
    assert response.status_code == 200
    
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

    response = client.post(f"/users/1/books/1")
    assert response.status_code  == 200

    response = client.delete(f"/users/1/books/1")
    assert response.status_code == 200
    assert response.json() == {"detail": "Book removed from user"}
    

def test_update_book_read_status(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123"
        },
    )
    assert response.status_code == 200
    
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
    response = client.post(f"/users/1/books/1")

    payload = {"is_read": True}
    response = client.patch(f"/users/1/books/1/read-status", json=payload)
    assert response.status_code == 200
    assert response.json() == {'detail': 'Read status updated', 'data': {'book': {'title': 'Test Book', 'id_book': 'test_book_1', 'id': 1, 'author': 'Test Author', 'description': None, 'category': 'Fiction', 'cover_url': 'http://example.com/cover.jpg', 'year': 2023}, 'is_read': True}}
    
    payload = {"is_read": False}
    response = client.patch(f"/users/1/books/1/read-status", json=payload)
    assert response.status_code == 200
    assert response.json() == {'detail': 'Read status updated', 'data': {'book': {'title': 'Test Book', 'id_book': 'test_book_1', 'id': 1, 'author': 'Test Author', 'description': None, 'category': 'Fiction', 'cover_url': 'http://example.com/cover.jpg', 'year': 2023}, 'is_read': False}}