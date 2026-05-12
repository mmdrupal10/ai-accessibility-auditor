# AI Accessibility Auditor

AI Accessibility Auditor is a full-stack web application that scans public webpages for accessibility issues and generates AI-powered recommendations. The system combines rule-based WCAG-inspired checks, screenshot capture, contrast detection, image and background-image analysis, WCAG references, and AI-generated accessibility feedback.

Repository: https://github.com/ics-professional-program/ics605-sp26-final-project-mmdrupal10

---

## Project Overview

Many websites contain accessibility problems such as missing alt text, empty links, unclear link labels, poor heading structure, low color contrast, and inaccessible visual content. These issues can make websites difficult to use for people who rely on screen readers, keyboard navigation, zoom, high-contrast settings, or other assistive technologies.

This project helps website owners, content editors, and developers identify possible accessibility issues and understand how to improve them. The goal is not only to detect problems, but also to explain them clearly using WCAG references and AI-generated recommendations.

The system combines traditional accessibility scanning techniques with AI-generated analysis to create a more understandable and user-friendly accessibility report.

---

## Key Features

- Scan any public webpage URL
- Capture a full-page screenshot using Playwright
- Detect headings, links, images, and CSS background images
- Identify empty links
- Identify vague link text
- Check heading order issues
- Detect missing image alt text
- Detect color contrast issues
- Remove duplicate image counts from responsive or repeated markup
- Add possible WCAG references to issue groups
- Generate AI-powered accessibility analysis
- Display strengths, concerns, and recommendations
- Display a polished report with score, screenshot, findings, WCAG notes, and recommendations

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript

### Backend

- FastAPI
- Python
- BeautifulSoup
- Playwright
- OpenAI API

---

## Project Structure

```text
ics605-sp26-final-project-mmdrupal10/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── health.py
│   │   │   └── scan.py
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── background_image_service.py
│   │   │   ├── contrast_service.py
│   │   │   ├── scan_service.py
│   │   │   └── screenshot_service.py
│   │   └── main.py
│   ├── data/
│   │   └── screenshots/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend-ui/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AccessibilityChecksSection.tsx
│   │   ├── AIAnalysisSection.tsx
│   │   ├── ContrastIssuesSection.tsx
│   │   ├── IssueBlock.tsx
│   │   ├── ReportHeader.tsx
│   │   ├── SampleContentSection.tsx
│   │   ├── ScanForm.tsx
│   │   ├── ScoreSection.tsx
│   │   ├── ScreenshotSection.tsx
│   │   └── SummaryGrid.tsx
│   ├── public/
│   ├── package.json
│   └── .env.local.example
│
├── README.md
└── .gitignore
```

---

## How the System Works

1. The user enters a webpage URL in the frontend.
2. The frontend sends the URL to the FastAPI backend.
3. The backend opens the page with Playwright and captures a full-page screenshot.
4. BeautifulSoup parses the page HTML.
5. The system extracts headings, links, normal images, and CSS background images.
6. Accessibility checks are performed:
   - missing image alt text
   - empty links
   - vague link text
   - heading order problems
   - color contrast issues
   - CSS background image detection
7. The system removes duplicate image entries caused by responsive or repeated page markup.
8. The backend adds possible WCAG references to detected issue groups.
9. The backend sends the screenshot and scan findings to the OpenAI API.
10. The AI generates a summary, strengths, concerns, and recommendations.
11. The frontend displays a complete accessibility report.

---

## AI Workflow

The AI component receives two main inputs:

1. A screenshot of the scanned webpage.
2. Structured scan findings from the backend.

The AI then produces:

- a short accessibility summary
- strengths of the page
- concerns that may affect accessibility
- practical recommendations for improvement

The AI is used to explain and contextualize the findings, not to replace WCAG testing or human review.

---

## Accessibility Checks Included

| Check | What It Looks For | Possible WCAG Reference |
|---|---|---|
| Missing image alt text | Images without meaningful alt text | WCAG 1.1.1 Non-text Content |
| Empty links | Links with no visible text or accessible name | WCAG 2.4.4 Link Purpose / WCAG 4.1.2 Name, Role, Value |
| Vague link text | Link text such as “click here” or “read more” | WCAG 2.4.4 Link Purpose |
| Heading order issues | Skipped heading levels such as H1 to H3 | WCAG 1.3.1 Info and Relationships |
| Low contrast text | Text/background contrast below WCAG threshold | WCAG 1.4.3 Contrast Minimum |
| Background images | CSS background images that may need review | WCAG 1.1.1 Non-text Content when meaningful |

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ics-professional-program/ics605-sp26-final-project-mmdrupal10.git
cd ics605-sp26-final-project-mmdrupal10
```

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Install Playwright browser support:

```bash
playwright install
```

Create a `.env` file inside the `backend` folder:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Open a second terminal.

Go to the frontend folder:

```bash
cd frontend-ui
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

---

## Environment Variables

### Backend

Create:

```text
backend/.env
```

Example:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend

Create:

```text
frontend-ui/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Note: The local development version currently calls the backend at `http://127.0.0.1:8000`.

---

## Running the Application Locally

You need two terminals.

### Terminal 1: Backend

```bash
cd backend
uvicorn app.main:app --reload
```

### Terminal 2: Frontend

```bash
cd frontend-ui
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Demo URLs

These pages were useful during development and testing.

### Strong Baseline Page

```text
https://www.kauai.hawaii.edu/nursing
```

This page usually produces a high accessibility score and demonstrates a successful scan.

### Page with Heading Order Issue

```text
https://www.kauai.hawaii.edu/transfer-programs
```

This page demonstrates heading hierarchy issues.

### Page with Contrast Issue and Image-Heavy Content

```text
https://ocet.kauai.hawaii.edu/advanced-career-training/
```

This page demonstrates image analysis, duplicate image handling, and contrast detection.

### Page with Empty Link Issue

```text
https://events.kauai.hawaii.edu/events/
```

This page demonstrates empty link detection from event/calendar navigation markup.

---

## Example Output

A typical scan report includes:

- page title and URL
- accessibility score
- page summary counts
- screenshot preview
- AI analysis
- contrast issues
- accessibility checks
- WCAG references
- sample headings
- sample links
- sample images
- background image results

---

## Demo Plan

For a live demo, the project can show:

1. A success case with a mostly accessible page.
2. A page with a heading order issue.
3. A page with a contrast issue.
4. A page with an empty link issue.

This demonstrates that the system can handle both successful scans and limitations or edge cases.

---

## Important Note About Compliance

This tool provides automated and AI-assisted accessibility insights. It does not guarantee full ADA or WCAG compliance.

A complete accessibility audit should also include manual testing.

Manual testing is still needed for:

- keyboard navigation
- screen reader behavior
- ARIA correctness
- focus order
- form labeling
- dynamic JavaScript interactions
- user testing with assistive technologies

---

## Known Limitations

- Some accessibility issues require manual review.
- AI recommendations may need human verification.
- JavaScript-heavy pages may produce different results depending on load timing.
- Some visual issues are difficult to detect without manual inspection.
- The tool currently checks individual pages, not entire websites.
- The tool does not yet perform full keyboard navigation testing.
- Some calendar, plugin, or icon-only controls may require manual verification.
- The tool does not replace a full legal ADA compliance audit.

---

## Future Improvements

- Add keyboard navigation testing
- Add ARIA validation
- Add screenshot annotations for detected issues
- Add PDF report export
- Add scan history
- Add batch scanning for multiple URLs
- Add shareable report links
- Deploy frontend and backend publicly
- Add user accounts for saved reports
- Add crawl mode for scanning multiple pages from the same website

---

## Files and Folders Not Uploaded to GitHub

The repository should not include generated files, secrets, or local environments.

Examples excluded by `.gitignore`:

- `.env`
- `.env.local`
- `API-Key.txt`
- `.conda/`
- `docs/`
- `share/`
- `node_modules/`
- `.next/`
- `__pycache__/`
- generated screenshots in `backend/data/screenshots/`

The `backend/data/screenshots/.gitkeep` file is included so GitHub keeps the screenshots folder structure without uploading generated screenshots.

---

## ICS 605 Course Context

This project was created for ICS 605 Applied AI as a final project.

It demonstrates a complete applied AI workflow:

- a clearly defined real-world problem
- a working full-stack system
- rule-based analysis
- AI-powered recommendations
- meaningful evaluation examples
- a live demo interface
- honest discussion of limitations

---

## Author

Maritza Medina