# scan_service.py
# Main website scanning logic.
# This file handles:
# - downloading the webpage HTML
# - finding the main content area
# - extracting headings, links, and images
# - checking accessibility issues
# - adding WCAG references
# - calculating the score
# - running screenshot, contrast, background image, and AI analysis

from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

from app.services.ai_service import generate_ai_analysis
from app.services.background_image_service import detect_background_images
from app.services.contrast_service import detect_contrast_issues
from app.services.screenshot_service import capture_screenshot


# WCAG references used in the scan results.
# These are added to issues so users know which rule may apply.
WCAG_REFERENCES = {
    "missing_alt": {
        "wcag": "WCAG 1.1.1 Non-text Content",
        "wcag_level": "Level A",
        "explanation": "Images that communicate meaning need text alternatives.",
    },
    "empty_link": {
        "wcag": "WCAG 2.4.4 Link Purpose (In Context) / WCAG 4.1.2 Name, Role, Value",
        "wcag_level": "Level A",
        "explanation": "Links need readable text or an accessible name so users understand the purpose.",
    },
    "vague_link": {
        "wcag": "WCAG 2.4.4 Link Purpose (In Context)",
        "wcag_level": "Level A",
        "explanation": "Link text should describe the destination or purpose.",
    },
    "heading_order": {
        "wcag": "WCAG 1.3.1 Info and Relationships",
        "wcag_level": "Level A",
        "explanation": "Heading structure should communicate page organization programmatically.",
    },
}


def normalize_link_text(text):
    """
    Normalize link text for easier matching.
    Example: "HERE." becomes "here"
    """
    return text.strip().lower().strip(".,!?:;")


def get_main_content(soup):
    """
    Try to find the main content section.
    This helps avoid scanning navigation and footer content.
    """
    main_tag = soup.find("main")
    if main_tag:
        return main_tag, "main"

    article_tag = soup.find("article")
    if article_tag:
        return article_tag, "article"

    role_main_tag = soup.find(attrs={"role": "main"})
    if role_main_tag:
        return role_main_tag, 'role="main"'

    # Fallback: scan the full page if no main content area exists
    return soup, "full page"


def check_heading_order(headings):
    """
    Check whether heading levels jump too far.
    Example: h1 -> h3 may be a problem because h2 was skipped.
    """
    issues = []
    previous_level = None

    for heading in headings:
        current_level = int(heading["tag"][1])
        current_text = heading["text"]

        if previous_level is not None:
            if current_level > previous_level + 1:
                issues.append({
                    "message": f"Heading level jumps from h{previous_level} to h{current_level} near '{current_text}'",
                    **WCAG_REFERENCES["heading_order"],
                })

        previous_level = current_level

    return issues


def get_link_accessible_text(link):
    """
    Get meaningful text for a link.

    First, try visible link text.
    If the link has no text but contains an image, use the image alt text.
    """
    text = link.get_text(strip=True)
    if text:
        return text

    image = link.find("img")
    if image:
        alt = image.get("alt")
        if alt and alt.strip():
            return f"[Image link] {alt.strip()}"

    return ""


def get_href_suggestion(href):
    """
    Suggest better link text based on the link URL.
    """
    href_lower = href.lower()

    if "how-to-apply" in href_lower:
        return "How to apply"
    if "costs" in href_lower and "apply" in href_lower:
        return "Application information"
    if "application" in href_lower:
        return "Application information"
    if "apply" in href_lower:
        return "Apply now"
    if "contact" in href_lower:
        return "Contact information"
    if "username" in href_lower or "login" in href_lower or "signin" in href_lower:
        return "Account login help"
    if "scholarship" in href_lower:
        return "Scholarship information"
    if "financial-aid" in href_lower or "financialaid" in href_lower:
        return "Financial aid information"
    if "program" in href_lower:
        return "Program information"
    if "schedule" in href_lower:
        return "Schedule information"
    if "details" in href_lower:
        return "View details"
    if "more-info" in href_lower or "information" in href_lower or "info" in href_lower:
        return "More information"

    # Fallback: use the last part of the URL path
    parsed = urlparse(href)
    path_parts = [part for part in parsed.path.split("/") if part]

    if path_parts:
        last_part = path_parts[-1].replace("-", " ").replace("_", " ").strip()
        if last_part:
            return last_part.title()

    return "View more information"


def suggest_link_text(link_text, href):
    """
    Generate a better suggestion for vague link text.
    """
    lower = normalize_link_text(link_text)
    href_based = get_href_suggestion(href)

    if lower == "click here":
        return f"Use a more descriptive link like: '{href_based}'"

    if lower == "here":
        return f"Use a more descriptive link like: '{href_based}'"

    if "click here to apply" in lower:
        return "Use a more descriptive link like: 'Apply now'"

    if "click here to learn about" in lower:
        topic = lower.replace("click here to learn about", "").strip()
        if topic:
            return f"Use a more descriptive link like: 'Learn about {topic.title()}'"
        return f"Use a more descriptive link like: '{href_based}'"

    if "click here for more information" in lower:
        return f"Use a more descriptive link like: '{href_based}'"

    if "click here" in lower:
        cleaned = lower.replace("click here", "").strip()
        if cleaned:
            return f"Use a more descriptive link like: '{cleaned.title()}'"
        return f"Use a more descriptive link like: '{href_based}'"

    if "learn more" in lower:
        topic = lower.replace("learn more about", "").replace("learn more", "").strip()
        if topic:
            return f"Use a more descriptive link like: 'Learn about {topic.title()}'"
        return f"Use a more descriptive link like: '{href_based}'"

    if "read more" in lower:
        return f"Use a more descriptive link like: '{href_based}'"

    if "information" in lower and "click here" in lower:
        return f"Use a more descriptive link like: '{href_based}'"

    if lower in {"details", "see more"}:
        return f"Use a more descriptive link like: '{href_based}'"

    return f"Use a more descriptive link like: '{href_based}'"


def calculate_accessibility_score(accessibility_checks, contrast_issue_count):
    """
    Calculate a simple accessibility score out of 100.
    """
    score = 100

    score -= accessibility_checks["images_missing_alt_count"] * 10
    score -= accessibility_checks["empty_link_count"] * 8
    score -= accessibility_checks["vague_link_count"] * 5
    score -= accessibility_checks["heading_order_issue_count"] * 7
    score -= contrast_issue_count * 2

    return max(score, 0)


def extract_headings(content_area):
    """
    Extract headings from the selected content area.
    """
    headings = []

    for tag_name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
        for tag in content_area.find_all(tag_name):
            text = tag.get_text(strip=True)
            if text:
                headings.append({
                    "tag": tag_name,
                    "text": text,
                })

    return headings


def extract_links(content_area):
    """
    Extract links and identify:
    - empty links
    - vague links
    """
    links = []
    empty_links = []
    vague_links = []

    vague_phrases = {
        "click here",
        "read more",
        "learn more",
        "details",
        "see more",
        "here",
    }

    for link in content_area.find_all("a", href=True):
        href = link["href"]
        link_text = get_link_accessible_text(link)
        display_text = link_text if link_text else "No link text"

        links.append({
            "text": display_text,
            "href": href,
        })

        # Empty link: no visible text and no image alt text
        if not link_text:
            empty_links.append({
                "href": href,
                **WCAG_REFERENCES["empty_link"],
            })

        # Vague link: text exists, but may not describe purpose well
        if link_text:
            lower_text = normalize_link_text(link_text)

            for phrase in vague_phrases:
                if phrase in lower_text:
                    vague_links.append({
                        "text": link_text,
                        "href": href,
                        "suggestion": suggest_link_text(link_text, href),
                        **WCAG_REFERENCES["vague_link"],
                    })
                    break

    return links, empty_links, vague_links


def extract_images(content_area):
    """
    Extract normal <img> tags and remove duplicates.

    Some WordPress pages include the same image multiple times because of
    responsive markup, lazy loading, or duplicated card layouts.
    """
    images = []
    missing_alt_count = 0
    images_missing_alt = []
    seen_images = set()

    for image in content_area.find_all("img"):
        src = image.get("src", "No source")
        alt = image.get("alt")

        if alt is None or alt.strip() == "":
            alt_text = "Missing alt text"
        else:
            alt_text = alt.strip()

        # Count each src + alt combination only once
        image_key = (src, alt_text)

        if image_key in seen_images:
            continue

        seen_images.add(image_key)

        # Missing alt issue
        if alt is None or alt.strip() == "":
            missing_alt_count += 1
            images_missing_alt.append({
                "src": src,
                **WCAG_REFERENCES["missing_alt"],
            })

        images.append({
            "src": src,
            "alt": alt_text,
        })

    return images, missing_alt_count, images_missing_alt


def run_accessibility_scan(url):
    """
    Main scan function.

    This returns one structured scan result to the frontend.
    """
    try:
        # 1. Capture screenshot
        screenshot_path = capture_screenshot(url)
        screenshot_filename = Path(screenshot_path).name
        screenshot_url = f"https://ai-accessibility-auditor.onrender.com/screenshots/{screenshot_filename}"

        # 2. Run rendered-page contrast detection
        contrast_results = detect_contrast_issues(url)
        contrast_issue_count = contrast_results["contrast_issue_count"]

        # 3. Detect CSS background images
        background_results = detect_background_images(url)
        background_image_count = background_results["background_image_count"]
        background_images = background_results["background_images"]

        # 4. Download page HTML
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # 5. Get page title
        page_title = "No title found"
        if soup.title and soup.title.string:
            page_title = soup.title.string.strip()

        # 6. Find main content area
        content_area, content_source = get_main_content(soup)

        # 7. Extract page content
        headings = extract_headings(content_area)
        links, empty_links, vague_links = extract_links(content_area)
        images, missing_alt_count, images_missing_alt = extract_images(content_area)

        # 8. If no normal images are found in main, check the full page
        if len(images) == 0:
            images, missing_alt_count, images_missing_alt = extract_images(soup)

        # 9. Check heading structure
        heading_order_issues = check_heading_order(headings)

        # 10. Build accessibility checks object
        accessibility_checks = {
            "empty_link_count": len(empty_links),
            "vague_link_count": len(vague_links),
            "heading_order_issue_count": len(heading_order_issues),
            "images_missing_alt_count": missing_alt_count,
            "empty_links": empty_links[:10],
            "vague_links": vague_links[:10],
            "heading_order_issues": heading_order_issues[:10],
            "images_missing_alt": images_missing_alt[:10],
        }

        # 11. Calculate score
        accessibility_score = calculate_accessibility_score(
            accessibility_checks,
            contrast_issue_count,
        )

        # 12. Generate AI analysis
        ai_analysis = generate_ai_analysis(
            page_title=page_title,
            screenshot_path=screenshot_path,
            accessibility_checks=accessibility_checks,
            contrast_issue_count=contrast_issue_count,
            heading_count=len(headings),
            link_count=len(links),
            image_count=len(images),
            images=images,
            background_image_count=background_image_count,
            background_images=background_images,
        )

        # 13. Return final scan result
        return {
            "message": "Website scanned successfully",
            "url": url,
            "title": page_title,
            "content_source": content_source,
            "screenshot_path": screenshot_path,
            "screenshot_url": screenshot_url,
            "accessibility_score": accessibility_score,
            "heading_count": len(headings),
            "link_count": len(links),
            "image_count": len(images),
            "images_missing_alt": missing_alt_count,
            "background_image_count": background_image_count,
            "background_images": background_images,
            "headings": headings[:10],
            "links": links[:10],
            "images": images[:10],
            "contrast_issue_count": contrast_issue_count,
            "contrast_issues": contrast_results["contrast_issues"],
            "accessibility_checks": accessibility_checks,
            "ai_analysis": ai_analysis,
        }

    except Exception as e:
        # Return error safely so frontend can display it
        return {
            "message": "Error scanning website",
            "url": url,
            "error": str(e),
        }