"use client";

// Main page for the Accessibility Auditor.
// This page controls the URL input, calls the backend,
// and arranges the final report into a PDF-style two-column layout.

import { useState } from "react";

import ScanForm from "../components/ScanForm";
import ReportHeader from "../components/ReportHeader";
import ScoreSection from "../components/ScoreSection";
import AIAnalysisSection from "../components/AIAnalysisSection";
import ScreenshotSection from "../components/ScreenshotSection";
import SummaryGrid from "../components/SummaryGrid";
import AccessibilityChecksSection from "../components/AccessibilityChecksSection";
import ContrastIssuesSection from "../components/ContrastIssuesSection";
import SampleContentSection from "../components/SampleContentSection";

// Type for one heading item returned by the backend
export type HeadingItem = {
  tag: string;
  text: string;
};

// Type for one link item returned by the backend
export type LinkItem = {
  text: string;
  href: string;
  suggestion?: string;
};

// Type for one normal image returned by the backend
export type ImageItem = {
  src: string;
  alt: string;
};

// Type for one CSS background image returned by the backend
export type BackgroundImageItem = {
  src: string;
  element: string;
  text_context: string;
  width: number;
  height: number;
};

// Type for one contrast issue returned by the backend
export type ContrastIssue = {
  text: string;
  color: string;
  background_color: string;
  font_size: string;
  font_weight: string;
  contrast_ratio: number;
  required_ratio: number;
  passes: boolean;
  wcag?: string;
  wcag_level?: string;
  explanation?: string;
};

// Type for accessibility checks returned by the backend
export type AccessibilityChecks = {
  empty_link_count: number;
  vague_link_count: number;
  heading_order_issue_count: number;
  images_missing_alt_count: number;

  empty_links: {
    href: string;
    wcag?: string;
    wcag_level?: string;
    explanation?: string;
  }[];

  vague_links: {
    text: string;
    href: string;
    suggestion?: string;
    wcag?: string;
    wcag_level?: string;
    explanation?: string;
  }[];

  heading_order_issues: {
    message: string;
    wcag?: string;
    wcag_level?: string;
    explanation?: string;
  }[];

  images_missing_alt: {
    src: string;
    wcag?: string;
    wcag_level?: string;
    explanation?: string;
  }[];
};

// Type for AI analysis returned by the backend
export type AIAnalysis = {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
};

// Type for the full scan result returned by the backend
export type ScanResult = {
  message: string;
  url: string;
  title: string;
  content_source: string;
  screenshot_path?: string;
  screenshot_url?: string;
  accessibility_score: number;
  heading_count: number;
  link_count: number;
  image_count: number;
  images_missing_alt: number;
  background_image_count: number;
  background_images: BackgroundImageItem[];
  headings: HeadingItem[];
  links: LinkItem[];
  images: ImageItem[];
  contrast_issue_count: number;
  contrast_issues: ContrastIssue[];
  accessibility_checks: AccessibilityChecks;
  ai_analysis: AIAnalysis;
};

export default function Home() {
  // Store the URL typed by the user
  const [url, setUrl] = useState("");

  // Store loading state while the scan is running
  const [loading, setLoading] = useState(false);

  // Store error message if the scan fails
  const [error, setError] = useState("");

  // Store the final scan result from the backend
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // Send the URL to the FastAPI backend
  const handleScan = async () => {
    if (!url.trim()) {
      setError("Please enter a website URL.");
      setScanResult(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setScanResult(null);

      const response = await fetch("http://127.0.0.1:8000/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

     // If the backend returns an error message, show it instead of rendering the report
    if (!response.ok || data.message === "Error scanning website" || !data.accessibility_checks) {
      setError(`Backend error: ${JSON.stringify(data, null, 2)}`);
      setScanResult(null);
      return;
    }

// Save successful scan result
setScanResult(data);

      // Scroll down slightly so the user sees the report
      window.scrollTo({ top: 220, behavior: "smooth" });
    } catch (err) {
      console.error("Error calling backend:", err);
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        color: "#111827",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "30px 22px 48px",
        }}
      >
        {/* Header section */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Small logo icon like the PDF */}
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                backgroundColor: "#111827",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              +
            </div>

            <h1
              style={{
                fontSize: "34px",
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              Accessibility Auditor
            </h1>
          </div>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            WCAG 2.1 · AI-powered
          </p>
        </header>

        {/* URL input and scan button */}
        <ScanForm
          url={url}
          setUrl={setUrl}
          loading={loading}
          onScan={handleScan}
        />

        {/* Error message */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              padding: "14px",
              borderRadius: "16px",
              marginBottom: "20px",
              color: "#991b1b",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Report content */}
        {scanResult && (
          <>
            {/* Light scanned page banner */}
            <ReportHeader scanResult={scanResult} />

            {/* PDF-style two-column report layout */}
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "420px 1fr",
                gap: "20px",
                alignItems: "start",
                marginTop: "20px",
              }}
            >
              {/* Left column: score, summary, preview */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <ScoreSection score={scanResult.accessibility_score} />

                <SummaryGrid scanResult={scanResult} />

                <ScreenshotSection
                  screenshotUrl={scanResult.screenshot_url}
                  title={scanResult.title}
                  url={scanResult.url}
                />
              </div>

              {/* Right column: AI analysis and detailed findings */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <AIAnalysisSection aiAnalysis={scanResult.ai_analysis} />

                <ContrastIssuesSection
                  contrastIssueCount={scanResult.contrast_issue_count}
                  contrastIssues={scanResult.contrast_issues}
                />

                <AccessibilityChecksSection
                  accessibilityChecks={scanResult.accessibility_checks}
                />

                <SampleContentSection
                  headings={scanResult.headings}
                  links={scanResult.links}
                  images={scanResult.images}
                  backgroundImages={scanResult.background_images}
                />
              </div>
            </section>

            {/* Footer */}
            <footer
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "30px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              <span>Built with AI + WCAG-inspired checks</span>
              <span>Accessibility Auditor</span>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}