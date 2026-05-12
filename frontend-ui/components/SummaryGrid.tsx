"use client";

// Page Summary component.
// This matches the PDF-style summary list instead of dashboard tiles.
// It shows each metric as a clean row with the count on the right.

import type { ScanResult } from "../app/page";

type SummaryGridProps = {
  scanResult: ScanResult;
};

export default function SummaryGrid({ scanResult }: SummaryGridProps) {
  // Summary rows shown in the left column
  const items = [
    ["Headings", scanResult.heading_count],
    ["Links", scanResult.link_count],
    ["Images", scanResult.image_count],
    ["Background images", scanResult.background_image_count],
    ["Missing alt", scanResult.accessibility_checks.images_missing_alt_count],
    ["Empty links", scanResult.accessibility_checks.empty_link_count],
    ["Vague links", scanResult.accessibility_checks.vague_link_count],
    ["Heading issues", scanResult.accessibility_checks.heading_order_issue_count],
    ["Contrast issues", scanResult.contrast_issue_count],
  ];

  // Green for 0 issues, orange/red for issue counts
  const getCountColor = (label: string, value: number) => {
    const issueLabels = [
      "Missing alt",
      "Empty links",
      "Vague links",
      "Heading issues",
      "Contrast issues",
    ];

    if (!issueLabels.includes(label)) {
      return "#111827";
    }

    return value === 0 ? "#047857" : "#c2410c";
  };

  return (
    <section
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "20px",
      }}
    >
      <p
        style={{
          margin: "0 0 14px",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#6b7280",
          letterSpacing: "0.09em",
          textTransform: "uppercase",
        }}
      >
        Page Summary
      </p>

      <div>
        {items.map(([label, value]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #f3f4f6",
              padding: "9px 0",
              fontSize: "15px",
            }}
          >
            <span style={{ color: "#4b5563" }}>{label}</span>

            <span
              style={{
                fontWeight: "bold",
                color: getCountColor(label as string, value as number),
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}