# screenshot_service.py
# This file contains helper code to open a webpage and save a screenshot.

from pathlib import Path
from urllib.parse import urlparse
import subprocess
from playwright.sync_api import sync_playwright


def make_safe_filename(url: str) -> str:
    """
    Turn a URL into a safer file name.
    Example:
    https://example.com/page -> example_com_page.png
    """
    parsed = urlparse(url)

    # Use domain + path, then clean up special characters
    domain = parsed.netloc.replace(".", "_")
    path = parsed.path.strip("/").replace("/", "_").replace("-", "_")

    if not path:
        path = "home"

    return f"{domain}_{path}.png"


def capture_screenshot(url: str, output_folder: str = "data/screenshots") -> str:
    """
    Open the page in a browser and save a full-page screenshot.

    Returns:
        The file path of the saved screenshot.
    """
    # Make sure the output folder exists
    Path(output_folder).mkdir(parents=True, exist_ok=True)

    # Build the output file path
    filename = make_safe_filename(url)
    file_path = Path(output_folder) / filename

    # Ensure Chromium browser exists on Render
    subprocess.run(["playwright", "install", "chromium"])

    # Launch Playwright browser and capture screenshot
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        try:
            page = browser.new_page(viewport={"width": 1440, "height": 900})

            # Open the page and wait for the main HTML to load
            page.goto(url, wait_until="domcontentloaded", timeout=30000)

            # Small pause to allow extra rendering
            page.wait_for_timeout(2000)

            # Save a full-page screenshot
            page.screenshot(path=str(file_path), full_page=True)

        finally:
            browser.close()

    return str(file_path)