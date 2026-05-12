"use client";

// Reusable card used for issue lists.

type IssueBlockProps = {
  title: string;
  count: number;
  children: React.ReactNode;
};

export default function IssueBlock({
  title,
  count,
  children,
}: IssueBlockProps) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "18px",
        marginBottom: "15px",
        backgroundColor: "white",
        boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        {title} ({count})
      </h3>
      {children}
    </div>
  );
}