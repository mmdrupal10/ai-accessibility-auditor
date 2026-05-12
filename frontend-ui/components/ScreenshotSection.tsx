"use client";

// Page screenshot preview component.
// This is designed to look like the compact preview card in the PDF layout.

type ScreenshotSectionProps = {
  screenshotUrl?: string;
  title: string;
  url: string;
};

export default function ScreenshotSection({
  screenshotUrl,
  title,
  url,
}: ScreenshotSectionProps) {
  if (!screenshotUrl) return null;

  // Display only the domain/path in a small label
  const shortUrl = url.replace("https://", "").replace("http://", "");

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
          margin: "0 0 12px",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#6b7280",
          letterSpacing: "0.09em",
          textTransform: "uppercase",
        }}
      >
        Page Preview
      </p>

      <div
        style={{
          marginBottom: "10px",
          color: "#6b7280",
          fontSize: "13px",
          wordBreak: "break-word",
        }}
      >
        {shortUrl}
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#f3f4f6",
          height: "310px",
        }}
      >
        <img
          src={screenshotUrl}
          alt={`Screenshot of ${title}`}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
      </div>
    </section>
  );
}