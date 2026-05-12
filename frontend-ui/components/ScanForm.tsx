"use client";

// Scan form component.
// This displays the URL input and scan button.

type ScanFormProps = {
  url: string;
  setUrl: (value: string) => void;
  loading: boolean;
  onScan: () => void;
};

export default function ScanForm({
  url,
  setUrl,
  loading,
  onScan,
}: ScanFormProps) {
  return (
    <section
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "14px",
        marginBottom: "18px",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.07)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            flex: 1,
            minWidth: "280px",
            padding: "14px 16px",
            fontSize: "15px",
            border: "1px solid #d1d5db",
            borderRadius: "14px",
            outline: "none",
            backgroundColor: "#f9fafb",
          }}
        />

        <button
          onClick={onScan}
          disabled={loading}
          style={{
            padding: "14px 20px",
            fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            border: "none",
            borderRadius: "14px",
            backgroundColor: loading ? "#93c5fd" : "#2563eb",
            color: "white",
            fontWeight: "bold",
            boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)",
          }}
        >
          {loading ? "Scanning..." : "Scan page"}
        </button>
      </div>
    </section>
  );
}