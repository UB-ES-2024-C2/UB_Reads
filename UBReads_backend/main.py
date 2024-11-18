from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import create_tables
from app.routers.user_router import router as user_router

app = FastAPI()

create_tables()

app.include_router(user_router)

origins = [
    "http://localhost",
    "http://localhost:5173",
]

# Allow requests from the frontend (port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI!"}
