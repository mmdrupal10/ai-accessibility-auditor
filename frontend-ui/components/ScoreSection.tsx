"use client";

// Accessibility score component.
// This card is designed to look like the large score block in the PDF layout.

type ScoreSectionProps = {
  score: number;
};

export default function ScoreSection({ score }: ScoreSectionProps) {
  // Pick color based on score range
  const getScoreColor = (value: number) => {
    if (value >= 90) return "#047857";
    if (value >= 70) return "#b45309";
    return "#b91c1c";
  };

  // Pick plain-language score label
  const getScoreLabel = (value: number) => {
    if (value >= 90) return "Good";
    if (value >= 70) return "Needs Improvement";
    return "Poor";
  };

  return (
    <section
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "20px",
        padding: "22px",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.07)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: "bold",
          color: "#6b7280",
          letterSpacing: "0.09em",
          textTransform: "uppercase",
        }}
      >
        Accessibility Score
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
          marginTop: "12px",
        }}
      >
        <span
          style={{
            fontSize: "68px",
            lineHeight: 1,
            fontWeight: "bold",
            color: getScoreColor(score),
            letterSpacing: "-0.06em",
          }}
        >
          {score}
        </span>

        <span style={{ fontSize: "22px", color: "#6b7280" }}>/ 100</span>
      </div>

      <div
        style={{
          display: "inline-block",
          marginTop: "12px",
          backgroundColor: score >= 90 ? "#ecfdf5" : "#fff7ed",
          color: getScoreColor(score),
          padding: "7px 12px",
          borderRadius: "999px",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {getScoreLabel(score)}
      </div>
    </section>
  );
}