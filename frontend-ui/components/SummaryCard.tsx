"use client";

// Small reusable stat card used in the summary grid.

type SummaryCardProps = {
  label: string;
  value: number;
};

export default function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "18px",
        backgroundColor: "white",
        boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: "14px", color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: "30px", fontWeight: "bold", marginTop: "8px" }}>
        {value}
      </div>
    </div>
  );
}