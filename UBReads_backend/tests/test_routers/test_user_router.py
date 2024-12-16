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

@pytest.mark.asyncio
async def test_get_current_user_valid_token(client):
    # Create user
    response = client.post(
        "/users/",
        json={
            "username": "valid_user",
            "email": "valid_user@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    assert response.status_code == 200

    # Generate a valid token for the user (login)
    login_response = client.post(
        "/token",
        data={"username": "valid_user", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    db = TestingSessionLocal()

    try:
        user = await get_current_user(
            security_scopes=SecurityScopes(scopes=[]),
            token=token,
            db=db,
        )
        # Validate retrieved user
        assert user.username == "valid_user"
        assert user.email == "valid_user@example.com"

    finally:
        db.close()

@pytest.mark.asyncio
async def test_get_current_user_invalid_token(client):
    # Create test user
    response = client.post(
        "/users/",
        json={
            "username": "valid_user",
            "email": "valid_user@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    assert response.status_code == 200

    # Generate a valid token for the user(login)
    login_response = client.post(
        "/token",
        data={"username": "valid_user", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_response.status_code == 200
    valid_token = login_response.json()["access_token"]

    invalid_token = valid_token[:-1]  # Remove last character to corrupt token

    db: Session = TestingSessionLocal()

    with pytest.raises(InvalidSignatureError):
        await get_current_user(
            security_scopes=SecurityScopes(scopes=[]),
            token=invalid_token,
            db=db,
        )

    db.close()


def test_create_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert response.json()["email"] == "testuser@example.com"


def test_create_existing_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert response.json()["email"] == "testuser@example.com"

    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "El usuario ya existe"


def test_create_existingmail_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert response.json()["email"] == "testuser@example.com"

    response = client.post(
        "/users/",
        json={
            "username": "testuser2",
            "email": "testuser@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "El correo electrónico ya está registrado"


def test_read_user(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser2",
            "email": "testuser2@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    user_id = response.json()["id"]

    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["username"] == "testuser2"


def test_read_user(client):
    response = client.get(f"/users/1")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_delete_user(client):
    # Create user
    response = client.post(
        "/users/",
        json={
            "username": "user_to_delete",
            "email": "delete@example.com",
            "password": "password123",
            "profile_pic": "prova"
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

    # Delete user
    delete_response = client.delete(
        "/users-delete/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert delete_response.status_code == 200
    assert delete_response.json()["detail"] == "User deleted successfully"

    # Try fetching deleted user
    get_response = client.get(f"/users/{user_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == "User not found"

def test_delete_nonexisting_user(client):
    # Delete user
    delete_response = client.delete(
        "/users-delete/"
    )
    assert delete_response.status_code == 401
    assert delete_response.json()["detail"] == "Not authenticated"


def test_get_users(client):
    # Add users to database
    
    response = client.get("/users/")
    assert response.status_code == 200
    
    # Assert correct number of users returned
    users = response.json()
    assert len(users) == 0
    client.post(
        "/users/",
        json={
            "username": "testuser1",
            "email": "testuser1@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    client.post(
        "/users/",
        json={
            "username": "testuser2",
            "email": "testuser2@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    
    # Get users
    response = client.get("/users/")
    
    assert response.status_code == 200
    
    # Assert correct number of users returned
    users = response.json()
    assert len(users) == 2
    
    # Check that data in the response is correct
    assert users[0]["username"] == "testuser1"
    assert users[0]["email"] == "testuser1@example.com"
    assert users[1]["username"] == "testuser2"
    assert users[1]["email"] == "testuser2@example.com"


def test_login(client):
    client.post(
        "/users/",
        json={
            "username": "testuser3",
            "email": "testuser3@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )

    response = client.post(
        "/token",
        data={"username": "testuser3", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_read_users_me(client):
    client.post(
        "/users/",
        json={
            "username": "testuser4",
            "email": "testuser4@example.com",
            "password": "password123",
            "profile_pic": "prova"
        },
    )
    login_response = client.post(
        "/token",
        data={"username": "testuser4", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = login_response.json()["access_token"]

    response = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["username"] == "testuser4"


@pytest.mark.asyncio
async def test_refresh_token_valid(client):
    # Create test user
    user_data = {"username": "valid_user", "email": "valid_user@example.com", "password": "password123","profile_pic": "prova"}
    user_response = client.post("/users/", json=user_data)
    assert user_response.status_code == 200

    # Create valid login token user
    login_response = client.post("/token", data={"username": "valid_user", "password": "password123"})
    assert login_response.status_code == 200
    access_token = login_response.json()["access_token"]
    refresh_token = login_response.json()["refresh_token"]

    # Make request to refresh token
    response = client.post(
        "/token/refresh", 
        json={"refresh_token": refresh_token}, 
    )
    
    # Assert that the response is valid and contains new access token
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_refresh_token_invalid(client):
    # Create test user
    user_data = {"username": "valid_user", "email": "valid_user@example.com", "password": "password123","profile_pic": "prova"}
    user_response = client.post("/users/", json=user_data)
    assert user_response.status_code == 200
    
    # Generate valid token (login)
    login_response = client.post("/token", data={"username": "valid_user", "password": "password123"})
    assert login_response.status_code == 200
    valid_refresh_token = login_response.json()["refresh_token"]

    invalid_refresh_token = valid_refresh_token[:-1]  # Corrupt token

    # Call refresh endpoint with invalid token
    response = client.post("/token/refresh", json={"refresh_token": invalid_refresh_token})
    
    # Assert response
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid refresh token"


def test_follow_user(client):
    # Create User1
    response_user1 = client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user1.status_code == 200
    id1 = response_user1.json()["username"]

    # Create User2
    response_user2 = client.post("/users/", json={"username": "user2", "email": "user2@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user2.status_code == 200
    id2 = response_user2.json()["username"]

    # User1 log in
    login_response = client.post(
        "/token",
        data={"username": "user1", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # User1 follows User2
    response = client.post(
        f"/users/{id1}/follow/{id2}",  # Correctly format the URL using f-strings
        headers={"Authorization": f"Bearer {token}"}
    )

    # Validate response
    assert response.status_code == 200
    assert response.json()["message"] == f"user1 is now following user2"


def test_follow_user_id(client):
    # Create User1
    response_user1 = client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user1.status_code == 200
    id1 = response_user1.json()["id"]

    # Create User2
    response_user2 = client.post("/users/", json={"username": "user2", "email": "user2@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user2.status_code == 200
    id2 = response_user2.json()["id"]

    # User1 logs in
    login_response = client.post(
        "/token",
        data={"username": "user1", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # User1 follows User2
    response = client.post(
        f"/{id1}/follow/{id2}", 
        headers={"Authorization": f"Bearer {token}"}
    )
    print(response)
    # Validate the response
    assert response.status_code == 200
    assert response.json()["message"] == f"User 1 is now following 2"


def test_follow_non_existent_user(client):
    response_user1 = client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user1.status_code == 200
    id1 = response_user1.json()["username"]
    id2 = 22
    login_response = client.post(
        "/token",
        data={"username": "user1", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    response = client.post(
        f"/users/{id1}/follow/{id2}", 
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "User or target to follow not found"


def test_follow_non_existent_user_id(client):
    response_user1 = client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user1.status_code == 200
    id1 = response_user1.json()["id"]
    id2 = "falseuser"
    login_response = client.post(
        "/token",
        data={"username": "user1", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    response = client.post(
        f"/users/{id1}/follow/{id2}", 
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "User or target to follow not found"


def test_unfollow_user(client):
    # Create User1
    response_user1 = client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user1.status_code == 200
    id1 = response_user1.json()["username"]

    # Create User2
    response_user2 = client.post("/users/", json={"username": "user2", "email": "user2@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user2.status_code == 200
    id2 = response_user2.json()["username"]

    # User1 logs in
    login_response = client.post(
        "/token",
        data={"username": "user1", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # User1 follows User2
    response_follow = client.post(
        f"/users/{id1}/follow/{id2}",
        headers={"Authorization": f"Bearer {token}"}
    )

    # Validate the response
    assert response_follow.status_code == 200
    assert response_follow.json()["message"] == f"user1 is now following user2"
    print(response_follow.json()["message"])

    response = client.delete("/1/unfollow/2", headers={"Content-Type": "application/x-www-form-urlencoded"})
    print(response.json())
    assert response.status_code == 200
    assert response.json()["message"] == "User 1 has unfollowed 2"


def test_unfollow_nonfollowed_user(client):
    # Create User1
    response_user1 = client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user1.status_code == 200
    id1 = response_user1.json()["username"]

    # Create User2
    response_user2 = client.post("/users/", json={"username": "user2", "email": "user2@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user2.status_code == 200
    id2 = response_user2.json()["username"]

    # User1 logs in
    login_response = client.post(
        "/token",
        data={"username": "user1", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    response = client.delete("/1/unfollow/2", headers={"Content-Type": "application/x-www-form-urlencoded"})
    print(response.json())
    assert response.status_code == 400
    assert response.json()["detail"] == "User is not following this target"


def test_unfollow_nonexisting_user(client):
    response_user1 = client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user1.status_code == 200
    id1 = response_user1.json()["username"]

    login_response = client.post(
        "/token",
        data={"username": "user1", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    response = client.delete("/1/unfollow/2", headers={"Content-Type": "application/x-www-form-urlencoded"})
    print(response.json())
    assert response.status_code == 400
    assert response.json()["detail"] == "User or target to unfollow not found"


def test_get_followers(client):
    # Create User1
    response_user1 = client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user1.status_code == 200
    id1 = response_user1.json()["username"]

    # Create User2
    response_user2 = client.post("/users/", json={"username": "user2", "email": "user2@example.com", "password": "password123","profile_pic": "prova"})
    assert response_user2.status_code == 200
    id2 = response_user2.json()["username"]

    # User1 logs in
    login_response = client.post(
        "/token",
        data={"username": "user1", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # User1 follows User2
    response = client.post(
        f"/users/{id1}/follow/{id2}", 
        headers={"Authorization": f"Bearer {token}"}
    )

    # Validate the response
    assert response.status_code == 200
    assert response.json()["message"] == f"user1 is now following user2"

    # Verificar seguidores de user4
    response = client.get("/2/followers")
    assert response.status_code == 200
    followers = response.json()["followers"]
    print(followers)
    assert len(followers) == 1
    assert followers[0]["username"] == "user1"


def test_get_following(client):
    # Create User1
    response_user1 = client.post("/users/", json={"username": "user1", "email": "user1@example.com", "password": "password123", "profile_pic": "prova"})
    assert response_user1.status_code == 200
    id1 = response_user1.json()["username"]

    # Create User2
    response_user2 = client.post("/users/", json={"username": "user2", "email": "user2@example.com", "password": "password123", "profile_pic": "prova"})
    assert response_user2.status_code == 200
    id2 = response_user2.json()["username"]

    # User1 logs in 
    login_response = client.post(
        "/token",
        data={"username": "user1", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # User1 follows User2
    response = client.post(
        f"/users/{id1}/follow/{id2}",  # Correctly format the URL using f-strings
        headers={"Authorization": f"Bearer {token}"}
    )

    # Validate response
    assert response.status_code == 200
    assert response.json()["message"] == f"user1 is now following user2"


    # Verificar seguidos de user5
    response = client.get("/1/following")
    assert response.status_code == 200
    following = response.json()["following"]
    assert len(following) == 1
    assert following[0]["username"] == "user2"
