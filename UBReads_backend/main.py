from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.database import create_tables
from app.routers.user_router import router as user_router
import os

app = FastAPI()

# Create database tables
create_tables()

# Include the user router
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

# Serve React frontend static files
frontend_build_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "UBReads_frontend", "dist")
if os.path.exists(frontend_build_path):  # Ensure the build folder exists
    app.mount("/", StaticFiles(directory=frontend_build_path, html=True), name="static")

    # Serve index.html for any unrecognized route
    @app.get("/{path_name:path}")
    async def serve_frontend(path_name: str):
        return FileResponse(os.path.join(frontend_build_path, "index.html"))

@app.get("/")
async def read_root():
    return {"message": "Welcome to UBReads!"}
