# contrast_service.py
# This file checks text color contrast on a rendered webpage using Playwright.
# It looks at visible text, compares text color against background color,
# and reports possible WCAG contrast issues.

from playwright.sync_api import sync_playwright


def detect_contrast_issues(url: str):
    """
    Open a page in a browser and detect low-contrast text.

    This version:
    - prefers content inside <main>
    - ignores duplicate issues
    - ignores short/icon-like labels
    - skips likely false positives such as white text detected on white background
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        try:
            page = browser.new_page(viewport={"width": 1440, "height": 900})

            # Load the rendered page
            page.goto(url, wait_until="domcontentloaded", timeout=30000)

            # Give styles time to settle
            page.wait_for_timeout(2000)

            # Run JavaScript in the browser so we can read computed styles
            contrast_results = page.evaluate(
                """
                () => {
                    // Convert rgb/rgba text into RGB numbers
                    function parseColor(colorString) {
                        const match = colorString.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/i);
                        if (!match) return null;

                        return {
                            r: parseInt(match[1], 10),
                            g: parseInt(match[2], 10),
                            b: parseInt(match[3], 10)
                        };
                    }

                    // Convert sRGB color value to linear value
                    function srgbToLinear(value) {
                        value = value / 255;
                        return value <= 0.03928
                            ? value / 12.92
                            : Math.pow((value + 0.055) / 1.055, 2.4);
                    }

                    // Calculate relative luminance
                    function getLuminance(rgb) {
                        const r = srgbToLinear(rgb.r);
                        const g = srgbToLinear(rgb.g);
                        const b = srgbToLinear(rgb.b);

                        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    }

                    // Calculate WCAG contrast ratio
                    function getContrastRatio(color1, color2) {
                        const lum1 = getLuminance(color1);
                        const lum2 = getLuminance(color2);

                        const lighter = Math.max(lum1, lum2);
                        const darker = Math.min(lum1, lum2);

                        return (lighter + 0.05) / (darker + 0.05);
                    }

                    // Check if two colors are basically the same
                    function colorsAreSame(color1, color2) {
                        return (
                            Math.abs(color1.r - color2.r) < 3 &&
                            Math.abs(color1.g - color2.g) < 3 &&
                            Math.abs(color1.b - color2.b) < 3
                        );
                    }

                    // Walk up the DOM tree to find a meaningful background color
                    function getEffectiveBackgroundColor(element) {
                        let current = element;

                        while (current) {
                            const styles = window.getComputedStyle(current);
                            const bg = styles.backgroundColor;

                            // Skip transparent backgrounds
                            if (
                                bg &&
                                bg !== "transparent" &&
                                bg !== "rgba(0, 0, 0, 0)"
                            ) {
                                return bg;
                            }

                            current = current.parentElement;
                        }

                        // Default to white if no background is found
                        return "rgb(255, 255, 255)";
                    }

                    // Check whether the element is visible on the page
                    function isVisible(element) {
                        const styles = window.getComputedStyle(element);
                        const rect = element.getBoundingClientRect();

                        return (
                            styles.display !== "none" &&
                            styles.visibility !== "hidden" &&
                            styles.opacity !== "0" &&
                            rect.width > 0 &&
                            rect.height > 0
                        );
                    }

                    // Decide whether text counts as large text under WCAG
                    function isLargeText(fontSizePx, fontWeight) {
                        const size = parseFloat(fontSizePx);
                        const weight = parseInt(fontWeight, 10);

                        // Large text: 18pt regular (~24px) or 14pt bold (~18.66px)
                        if (weight >= 700) {
                            return size >= 18.66;
                        }

                        return size >= 24;
                    }

                    // Prefer scanning main content when available
                    const root = document.querySelector("main") || document.body;

                    // Ignore common icon/social labels
                    const ignoredLabels = new Set([
                        "facebook",
                        "instagram",
                        "twitter",
                        "youtube",
                        "linkedin",
                        "search",
                        "menu"
                    ]);

                    const elements = Array.from(root.querySelectorAll("*"));
                    const issues = [];
                    const seen = new Set();

                    for (const element of elements) {
                        if (!isVisible(element)) continue;

                        const text = element.innerText ? element.innerText.trim() : "";

                        // Ignore empty, tiny, or very large text blocks
                        if (!text) continue;
                        if (text.length < 4) continue;
                        if (text.length > 200) continue;

                        // Ignore common icon labels
                        if (ignoredLabels.has(text.toLowerCase())) continue;

                        const styles = window.getComputedStyle(element);
                        const color = styles.color;
                        const backgroundColor = getEffectiveBackgroundColor(element);
                        const fontSize = styles.fontSize;
                        const fontWeight = styles.fontWeight;

                        const textRgb = parseColor(color);
                        const bgRgb = parseColor(backgroundColor);

                        if (!textRgb || !bgRgb) continue;

                        // Skip likely false positives:
                        // If text and background are the same color, this is often hidden text,
                        // overlay text, or a case where computed background is not the visual background.
                        // This avoids false white-on-white contrast errors.
                        if (colorsAreSame(textRgb, bgRgb)) {
                            continue;
                        }

                        const contrastRatio = getContrastRatio(textRgb, bgRgb);
                        const largeText = isLargeText(fontSize, fontWeight);
                        const requiredRatio = largeText ? 3.0 : 4.5;

                        if (contrastRatio < requiredRatio) {
                            const shortText = text.slice(0, 120);

                            // Avoid duplicate reports
                            const signature = [
                                shortText,
                                color,
                                backgroundColor,
                                fontSize
                            ].join("|");

                            if (seen.has(signature)) continue;
                            seen.add(signature);

                            issues.push({
                                text: shortText,
                                color: color,
                                background_color: backgroundColor,
                                font_size: fontSize,
                                font_weight: fontWeight,
                                contrast_ratio: Number(contrastRatio.toFixed(2)),
                                required_ratio: requiredRatio,
                                passes: false,
                                wcag: "WCAG 1.4.3 Contrast (Minimum)",
                                wcag_level: "Level AA",
                                explanation: "Normal text should usually have a contrast ratio of at least 4.5:1."
                            });
                        }
                    }

                    return {
                        contrast_issue_count: issues.length,
                        contrast_issues: issues.slice(0, 10)
                    };
                }
                """
            )

        finally:
            browser.close()

    return contrast_results