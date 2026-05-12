"use client";

// Report header component.
// Shows the scanned page title, URL, scan timing, and content source.

import type { ScanResult } from "../app/page";

type ReportHeaderProps = {
  scanResult: ScanResult;
};

export default function ReportHeader({ scanResult }: ReportHeaderProps) {
  return (
    <section
      style={{
        backgroundColor: "#111827",
        color: "white",
        borderRadius: "22px",
        padding: "24px",
        marginBottom: "18px",
        boxShadow: "0 14px 32px rgba(15, 23, 42, 0.18)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "28px",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}
      >
        {scanResult.title}
      </h2>

      <p
        style={{
          margin: "10px 0 0",
          color: "#d1d5db",
          wordBreak: "break-word",
        }}
      >
        {scanResult.url}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "16px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            backgroundColor: "#ecfdf5",
            color: "#047857",
            padding: "7px 11px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          Scanned just now · {scanResult.content_source}
        </span>

        <span
          style={{
            backgroundColor: "#1f2937",
            color: "#e5e7eb",
            padding: "7px 11px",
            borderRadius: "999px",
            fontSize: "13px",
          }}
        >
          {scanResult.message}
        </span>
      </div>
    </section>
  );
}