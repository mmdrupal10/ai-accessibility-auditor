# background_image_service.py
# Detects CSS background images on a rendered webpage.
# Some visible images are not normal <img> tags.
# They are sometimes added with CSS background-image.

from playwright.sync_api import sync_playwright


def detect_background_images(url: str):
    """
    Detect visible CSS background images on a webpage.

    Returns:
        {
            "background_image_count": number,
            "background_images": list
        }
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        try:
            page = browser.new_page(viewport={"width": 1440, "height": 900})

            # Load the rendered page
            page.goto(url, wait_until="domcontentloaded", timeout=30000)

            # Give CSS and images time to render
            page.wait_for_timeout(2000)

            results = page.evaluate(
                """
                () => {
                    // Prefer main content when available
                    const root = document.querySelector("main") || document.body;

                    // Store unique background image URLs
                    const seen = new Set();
                    const backgroundImages = [];

                    // Get all elements in the selected area
                    const elements = Array.from(root.querySelectorAll("*"));

                    function isVisible(element) {
                        const styles = window.getComputedStyle(element);
                        const rect = element.getBoundingClientRect();

                        return (
                            styles.display !== "none" &&
                            styles.visibility !== "hidden" &&
                            styles.opacity !== "0" &&
                            rect.width > 20 &&
                            rect.height > 20
                        );
                    }

                    function extractUrl(backgroundImageValue) {
                        // Ignore empty values
                        if (!backgroundImageValue || backgroundImageValue === "none") {
                            return null;
                        }

                        // Ignore gradients for now
                        if (backgroundImageValue.includes("gradient")) {
                            return null;
                        }

                        // Extract URL from: url("...")
                        const match = backgroundImageValue.match(/url\\(["']?(.*?)["']?\\)/);

                        if (!match || !match[1]) {
                            return null;
                        }

                        try {
                            return new URL(match[1], document.baseURI).href;
                        } catch {
                            return match[1];
                        }
                    }

                    for (const element of elements) {
                        if (!isVisible(element)) continue;

                        const styles = window.getComputedStyle(element);
                        const imageUrl = extractUrl(styles.backgroundImage);

                        if (!imageUrl) continue;

                        // Do not count the same background image twice
                        if (seen.has(imageUrl)) continue;
                        seen.add(imageUrl);

                        const text = element.innerText ? element.innerText.trim() : "";
                        const rect = element.getBoundingClientRect();

                        backgroundImages.push({
                            src: imageUrl,
                            element: element.tagName.toLowerCase(),
                            text_context: text.slice(0, 120),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        });
                    }

                    return {
                        background_image_count: backgroundImages.length,
                        background_images: backgroundImages.slice(0, 10)
                    };
                }
                """
            )

        finally:
            browser.close()

    return results