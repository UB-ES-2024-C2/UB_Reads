import pytest
from jwt import InvalidSignatureError
from sqlalchemy import inspect
import asyncio
from fastapi import Depends, HTTPException
from fastapi.security import SecurityScopes
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker
from app.core.models import User
from app.routers.user_router import get_current_user
from app.core.database import get_db, Base
from main import app
from app.schemas.user import UserCreate, UserLogin

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
# Bind a single connection for the entire lifecycle of the tests
testing_connection = test_engine.connect()
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=testing_connection)


# Fixture to set up the database and create tables once
@pytest.fixture(scope="function", autouse=True)  # Autouse ensures this runs before every test
def setup_test_db():
    # Use the same connection for creating tables
    Base.metadata.create_all(bind=testing_connection)

    # Ensure tables are created
    inspector = inspect(test_engine)
    print("Tables in the database:", inspector.get_table_names())

    yield  # This ensures the fixture is reusable across tests

    # Drop tables after the test
    Base.metadata.drop_all(bind=testing_connection)

# Fixture to override get_db dependency and use the same session
@pytest.fixture(scope="function")
def client():
    def override_get_db():
        db = TestingSessionLocal()  # Reuse the same connection
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

@pytest.mark.asyncio
async def test_get_current_user_valid_token(client):
    # Step 1: Create a test user
    response = client.post(
        "/users/",
        json={
            "username": "valid_user",
            "email": "valid_user@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 200

    # Step 2: Generate a valid token for the user
    login_response = client.post(
        "/token",
        data={"username": "valid_user", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # Step 3: Create a real database session
    db = TestingSessionLocal()

    try:
        # Simulate calling get_current_user with mocked dependencies
        user = await get_current_user(
            security_scopes=SecurityScopes(scopes=[]),  # No specific security scopes needed
            token=token,
            db=db,
        )
        # Step 4: Validate the retrieved user
        assert user.username == "valid_user"
        assert user.email == "valid_user@example.com"

    finally:
        db.close()  # Ensure the session is closed after the test

@pytest.mark.asyncio
async def test_get_current_user_invalid_token(client):
    # Step 1: Create a test user
    response = client.post(
        "/users/",
        json={
            "username": "valid_user",
            "email": "valid_user@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 200

    # Step 2: Generate a valid token for the user
    login_response = client.post(
        "/token",
        data={"username": "valid_user", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_response.status_code == 200
    valid_token = login_response.json()["access_token"]

    # Step 3: Simulate an invalid token by modifying the valid one
    invalid_token = valid_token[:-1]  # Remove the last character to corrupt the token

    # Step 4: Create a real database session
    db: Session = TestingSessionLocal()

    # Step 5: Simulate calling get_current_user with the invalid token
    with pytest.raises(InvalidSignatureError):
        await get_current_user(
            security_scopes=SecurityScopes(scopes=[]),  # No specific scopes needed
            token=invalid_token,
            db=db,
        )

    db.close()  # Ensure the session is closed after the test

# Test para crear un usuario
def test_create_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123"
        },
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert response.json()["email"] == "testuser@example.com"

# Test para obtener un usuario por ID
def test_read_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser2",
            "email": "testuser2@example.com",
            "password": "password123"
        },
    )
    user_id = response.json()["id"]

    # Obtener el usuario por ID
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["username"] == "testuser2"


def test_delete_user(client):
    # Create the user
    response = client.post(
        "/users/",
        json={
            "username": "user_to_delete",
            "email": "delete@example.com",
            "password": "password123"
        },
    )
    assert response.status_code == 200
    user_id = response.json()["id"]

    # Log in to get token
    login_response = client.post(
        "/token",
        data={"username": "user_to_delete", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # Delete the user using the token
    delete_response = client.delete(
        "/users-delete/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert delete_response.status_code == 200
    assert delete_response.json()["detail"] == "User deleted successfully"

    # Try fetching the deleted user
    get_response = client.get(f"/users/{user_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == "User not found"


# Import necessary modules
def test_get_users(client):
    # Step 1: Add some users to the database
    client.post(
        "/users/",
        json={
            "username": "testuser1",
            "email": "testuser1@example.com",
            "password": "password123"
        },
    )
    client.post(
        "/users/",
        json={
            "username": "testuser2",
            "email": "testuser2@example.com",
            "password": "password123"
        },
    )
    
    # Step 2: Make a GET request to /users/
    response = client.get("/users/")
    
    # Step 3: Assert that the response status is 200 OK
    assert response.status_code == 200
    
    # Step 4: Assert the correct number of users are returned
    users = response.json()
    assert len(users) == 2
    
    # Step 5: Check that the data in the response is correct
    # Assert for each user that returned matches the data we posted
    assert users[0]["username"] == "testuser1"
    assert users[0]["email"] == "testuser1@example.com"
    assert users[1]["username"] == "testuser2"
    assert users[1]["email"] == "testuser2@example.com"

# Test para iniciar sesión y obtener un token
def test_login(client):
    client.post(
        "/users/",
        json={
            "username": "testuser3",
            "email": "testuser3@example.com",
            "password": "password123"
        },
    )

    # Iniciar sesión
    response = client.post(
        "/token",
        data={"username": "testuser3", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

# Test para obtener información del usuario autenticado
def test_read_users_me(client):
    client.post(
        "/users/",
        json={
            "username": "testuser4",
            "email": "testuser4@example.com",
            "password": "password123"
        },
    )
    login_response = client.post(
        "/token",
        data={"username": "testuser4", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = login_response.json()["access_token"]

    # Obtener usuario actual
    response = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["username"] == "testuser4"

# Test para seguir a otro usuario
def test_follow_user(client):
    client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123"})
    client.post("/users/", json={"username": "user2", "email": "user2@example.com", "password": "password123"})

    # Usuario 1 sigue a Usuario 2
    response = client.post("/users/user1/follow/user2")
    assert response.status_code == 200
    assert response.json()["message"] == "user1 is now following user2"


@pytest.mark.asyncio
async def test_refresh_token_valid(client):
    # Step 1: Create a test user
    user_data = {"username": "valid_user", "email": "valid_user@example.com", "password": "password123"}
    user_response = client.post("/users/", json=user_data)
    assert user_response.status_code == 200

    # Step 2: Create a valid login token for the user (this provides both access and refresh tokens)
    login_response = client.post("/token", data={"username": "valid_user", "password": "password123"})
    assert login_response.status_code == 200
    access_token = login_response.json()["access_token"]
    refresh_token = login_response.json()["refresh_token"]

    # Step 3: Make a request to refresh the token with the valid refresh token
    response = client.post(
        "/token/refresh", 
        json={"refresh_token": refresh_token}, 
    )
    
    # Assert that the response is valid and contains a new access token
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"



@pytest.mark.asyncio
async def test_refresh_token_invalid(client):
    # Step 1: Create a test user
    user_data = {"username": "valid_user", "email": "valid_user@example.com", "password": "password123"}
    user_response = client.post("/users/", json=user_data)
    assert user_response.status_code == 200
    
    # Step 2: Generate a valid token for the user
    login_response = client.post("/token", data={"username": "valid_user", "password": "password123"})
    assert login_response.status_code == 200
    valid_refresh_token = login_response.json()["refresh_token"]

    # Step 3: Simulate an invalid refresh token by altering it
    invalid_refresh_token = valid_refresh_token[:-1]  # Corrupt the token (remove the last character)

    # Step 4: Call the refresh endpoint with the invalid token
    response = client.post("/token/refresh", json={"refresh_token": invalid_refresh_token})
    
    # Assert that the response status code is 401 (Unauthorized)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid refresh token"


# Test para verificar seguidores
"""def test_get_followers(client):
    client.post("/users/", json={"username": "user3", "email": "user3@example.com", "password": "password123"})
    client.post("/users/", json={"username": "user4", "email": "user4@example.com", "password": "password123"})
    client.post("/users/user3/follow/user4")

    # Verificar seguidores de user4
    response = client.get("/users/4/followers")
    assert response.status_code == 200
    followers = response.json()["followers"]
    assert len(followers) == 1
    assert followers[0]["username"] == "user3"

# Test para verificar seguidos
def test_get_following(client):
    client.post("/users/", json={"username": "user5", "email": "user5@example.com", "password": "password123"})
    client.post("/users/", json={"username": "user6", "email": "user6@example.com", "password": "password123"})
    client.post("/users/user5/follow/user6")

    # Verificar seguidos de user5
    response = client.get("/users/5/following")
    assert response.status_code == 200
    following = response.json()["following"]
    assert len(following) == 1
    assert following[0]["username"] == "user6"

"""