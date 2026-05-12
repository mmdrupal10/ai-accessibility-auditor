# ai_service.py
# Sends scan findings and screenshot evidence to the AI model.
# The AI reviews layout, accessibility issues, recommendations,
# and whether images seem informative or decorative.

import base64
import json

from openai import OpenAI

# Uses OPENAI_API_KEY from your environment
client = OpenAI()


def image_file_to_data_url(image_path):
    """
    Convert a screenshot file into a base64 data URL.
    This lets the AI model inspect the screenshot.
    """
    with open(image_path, "rb") as image_file:
        encoded = base64.b64encode(image_file.read()).decode("utf-8")

    return f"data:image/png;base64,{encoded}"


def generate_ai_analysis(
    page_title,
    screenshot_path,
    accessibility_checks,
    contrast_issue_count,
    heading_count,
    link_count,
    image_count,
    images,
    background_image_count,
    background_images,
):
    """
    Generate real AI accessibility analysis using:
    - screenshot
    - accessibility checks
    - normal images
    - background images
    """
    try:
        image_data_url = image_file_to_data_url(screenshot_path)

        findings = {
            "page_title": page_title,
            "heading_count": heading_count,
            "link_count": link_count,
            "image_count": image_count,
            "images": images[:10],
            "background_image_count": background_image_count,
            "background_images": background_images[:10],
            "contrast_issue_count": contrast_issue_count,
            "accessibility_checks": accessibility_checks,
        }

        prompt_text = f"""
You are an accessibility auditor.

Analyze the webpage screenshot and scan findings.

Pay special attention to:
- whether images appear informative or decorative
- whether CSS background images may contain meaningful content
- whether image alt text appears useful, repetitive, or unnecessary
- whether page layout, headings, links, and contrast seem accessible

Rule-based findings:
{json.dumps(findings, indent=2)}

Return ONLY valid JSON with this exact structure:
{{
  "summary": "short paragraph",
  "strengths": ["item 1", "item 2"],
  "concerns": ["item 1", "item 2"],
  "recommendations": ["item 1", "item 2"]
}}

Rules:
- Do not invent issues that are not visually plausible.
- Mention background images only if they appear meaningful or risky.
- If images look decorative, recommend empty alt text or CSS background treatment.
- If images communicate important information, recommend meaningful alt text.
- Keep the response practical for a web editor or developer.
"""

        response = client.responses.create(
            model="gpt-5.4",
            input=[
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": prompt_text},
                        {
                            "type": "input_image",
                            "image_url": image_data_url,
                            "detail": "high",
                        },
                    ],
                }
            ],
        )

        parsed = json.loads(response.output_text)

        return {
            "summary": parsed.get("summary", "No summary returned."),
            "strengths": parsed.get("strengths", []),
            "concerns": parsed.get("concerns", []),
            "recommendations": parsed.get("recommendations", []),
        }

    except Exception as e:
        return {
            "summary": "AI analysis could not be completed.",
            "strengths": [],
            "concerns": [f"AI service error: {str(e)}"],
            "recommendations": [
                "Check the API key, model access, and AI service configuration."
            ],
        }