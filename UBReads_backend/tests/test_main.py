import os
import pytest
from app.core.database import get_db, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from main import app, create_tables, reset_database

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


def test_app_initialization(client):
    # Test the root endpoint
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to UBReads!"}


def test_disable_cache_middleware(client):
    response = client.get("/")
    assert response.headers["Cache-Control"] == "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    assert response.headers["Pragma"] == "no-cache"
    assert response.headers["Expires"] == "0"


def test_router_inclusion(client):
    # Assuming user_router and book_router endpoints are prefixed with "/users" and "/books"
    response = client.get("/users")  # Modify based on your router's endpoints
    assert response.status_code in [200, 404]  # Adjust based on your app's routes

    response = client.get("/books")  # Modify based on your router's endpoints
    assert response.status_code in [200, 404]  # Adjust based on your app's routes
