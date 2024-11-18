from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import create_tables
from app.routers.user_router import router as user_router

app = FastAPI()

# Create database tables
create_tables()

app.include_router(user_router)

# Configure CORS for development and production
origins = [
    "http://localhost",
    "http://localhost:5173", # Development frontend URL
    "https://<YOUR_PRODUCTION_URL>", # Production frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to UBReads!"}
