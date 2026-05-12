# main.py
# This is the starting point for the FastAPI backend.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers.health import router as health_router
from app.routers.scan import router as scan_router

# Create the FastAPI application
app = FastAPI(
    title="AI Accessibility Auditor",
    description="Backend API for scanning websites for accessibility",
    version="1.0.0"
)

# Allow the frontend to talk to the backend
# This is needed because the frontend runs on localhost:3000
# and the backend runs on 127.0.0.1:8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-accessibility-auditor-xi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Expose the screenshots folder as static files
# This allows the frontend to load screenshot images in the browser
app.mount("/screenshots", StaticFiles(directory="data/screenshots"), name="screenshots")

# Include route files
app.include_router(health_router)
app.include_router(scan_router)


@app.get("/")
def root():
    """
    Simple root route so we can test that the API is running.
    """
    return {"message": "AI Accessibility Auditor API is running"}