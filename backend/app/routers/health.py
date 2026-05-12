# health.py
# This file contains a simple health check route.

from fastapi import APIRouter

# APIRouter helps organize routes into separate files
router = APIRouter()


@router.get("/health")
def health_check():
    """
    Health check endpoint.
    Useful for testing if the backend is alive.
    """
    return {
        "status": "ok",
        "message": "Backend is healthy"
    }