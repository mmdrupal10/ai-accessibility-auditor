# scan.py
# This file contains the scan endpoint.
# It receives a URL from the frontend and returns the scan result.

from fastapi import APIRouter
from pydantic import BaseModel, HttpUrl

from app.services.scan_service import run_accessibility_scan

# Create the router object for this file
router = APIRouter()


class ScanRequest(BaseModel):
    """
    This model defines the data sent from the frontend.
    For now, we only need a URL.
    """
    url: HttpUrl


@router.post("/scan")
def scan_website(request: ScanRequest):
    """
    Receive a URL and return the scan result.
    """
    return run_accessibility_scan(str(request.url))