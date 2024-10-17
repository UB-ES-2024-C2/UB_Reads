from fastapi import FastAPI
from .auth import router as auth_router  # Using relative import
from .models import Base
from .database import engine

# Create the database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}
