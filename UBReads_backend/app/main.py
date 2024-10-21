from fastapi import FastAPI
from .auth import router as auth_router
from .books import router as books_router
from .database import engine
from .models import Base

# Create the database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(books_router, prefix="/books", tags=["books"])