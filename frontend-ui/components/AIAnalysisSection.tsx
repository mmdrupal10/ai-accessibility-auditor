"use client";

// AI Analysis component.
// This matches the PDF-style layout with colored cards:
// green for strengths, orange for concerns, and lavender/blue for recommendations.

import type { AIAnalysis } from "../app/page";

type AIAnalysisSectionProps = {
  aiAnalysis: AIAnalysis;
};

export default function AIAnalysisSection({
  aiAnalysis,
}: AIAnalysisSectionProps) {
  return (
    <section
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "22px",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "24px",
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "999px",
            backgroundColor: "#9ca3af",
            display: "inline-block",
          }}
        />
        AI Analysis
      </h2>

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.65,
          marginTop: "14px",
          marginBottom: "18px",
          fontSize: "15px",
        }}
      >
        {aiAnalysis.summary}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "14px",
        }}
      >
        <AnalysisBox
          title="Strengths"
          items={aiAnalysis.strengths}
          labelColor="#047857"
          backgroundColor="#ecfdf5"
          borderColor="#a7f3d0"
        />

        <AnalysisBox
          title="Concerns"
          items={aiAnalysis.concerns}
          labelColor="#c2410c"
          backgroundColor="#fff7ed"
          borderColor="#fed7aa"
        />

        <AnalysisBox
          title="Recommendations"
          items={aiAnalysis.recommendations}
          labelColor="#3730a3"
          backgroundColor="#eef2ff"
          borderColor="#c7d2fe"
        />
      </div>
    </section>
  );
}

// Reusable colored AI box
function AnalysisBox({
  title,
  items,
  labelColor,
  backgroundColor,
  borderColor,
}: {
  title: string;
  items: string[];
  labelColor: string;
  backgroundColor: string;
  borderColor: string;
}) {
  return (
    <div
      style={{
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "14px",
        padding: "14px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: labelColor,
          fontSize: "12px",
          fontWeight: "bold",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </p>

      {items.length > 0 ? (
        <ul
          style={{
            margin: 0,
            paddingLeft: "18px",
            lineHeight: 1.55,
            color: "#374151",
          }}
        >
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: "6px" }}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ margin: 0, color: "#6b7280" }}>No items listed.</p>
      )}
    </div>
  );
}