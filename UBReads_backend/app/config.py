import os

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# TODO change before production