"use client";

// AccessibilityChecksSection.tsx
// This component displays the accessibility issue groups:
// - empty links
// - vague link text
// - heading order issues
// - images missing alt text
//
// WCAG notes are shown once per group, not repeated under every item.

import type { AccessibilityChecks } from "../app/page";
import IssueBlock from "./IssueBlock";

type AccessibilityChecksSectionProps = {
  accessibilityChecks: AccessibilityChecks;
};

// Small reusable WCAG note box.
// This appears once under each issue group title.
function WCAGNote({
  wcag,
  wcagLevel,
  explanation,
}: {
  wcag?: string;
  wcagLevel?: string;
  explanation?: string;
}) {
  if (!wcag) return null;

  return (
    <div
      style={{
        marginBottom: "14px",
        padding: "9px 11px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        fontSize: "13px",
        color: "#374151",
      }}
    >
      <strong>Possible WCAG issue:</strong> {wcag}
      {wcagLevel && <> — {wcagLevel}</>}

      {explanation && (
        <div style={{ marginTop: "4px", color: "#6b7280" }}>
          {explanation}
        </div>
      )}
    </div>
  );
}

export default function AccessibilityChecksSection({
  accessibilityChecks,
}: AccessibilityChecksSectionProps) {
  return (
    <section style={{ marginBottom: "25px" }}>
      <h2>Accessibility Checks</h2>

      {/* Empty links */}
      <IssueBlock
        title="Empty Links"
        count={accessibilityChecks.empty_link_count}
      >
        {accessibilityChecks.empty_links.length > 0 ? (
          <>
            <WCAGNote
              wcag={accessibilityChecks.empty_links[0].wcag}
              wcagLevel={accessibilityChecks.empty_links[0].wcag_level}
              explanation={accessibilityChecks.empty_links[0].explanation}
            />

            <ul>
              {accessibilityChecks.empty_links.map((item, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  {item.href}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No empty links found.</p>
        )}
      </IssueBlock>

      {/* Vague link text */}
      <IssueBlock
        title="Vague Link Text"
        count={accessibilityChecks.vague_link_count}
      >
        {accessibilityChecks.vague_links.length > 0 ? (
          <>
            <WCAGNote
              wcag={accessibilityChecks.vague_links[0].wcag}
              wcagLevel={accessibilityChecks.vague_links[0].wcag_level}
              explanation={accessibilityChecks.vague_links[0].explanation}
            />

            <ul>
              {accessibilityChecks.vague_links.map((item, index) => (
                <li key={index} style={{ marginBottom: "12px" }}>
                  <div>
                    <strong>Text:</strong> {item.text}
                  </div>
                  <div>
                    <strong>Href:</strong> {item.href}
                  </div>
                  {item.suggestion && (
                    <div>
                      <strong>Suggestion:</strong> {item.suggestion}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No vague links found.</p>
        )}
      </IssueBlock>

      {/* Heading order issues */}
      <IssueBlock
        title="Heading Order Issues"
        count={accessibilityChecks.heading_order_issue_count}
      >
        {accessibilityChecks.heading_order_issues.length > 0 ? (
          <>
            <WCAGNote
              wcag={accessibilityChecks.heading_order_issues[0].wcag}
              wcagLevel={accessibilityChecks.heading_order_issues[0].wcag_level}
              explanation={accessibilityChecks.heading_order_issues[0].explanation}
            />

            <ul>
              {accessibilityChecks.heading_order_issues.map((issue, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  {issue.message}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No heading order issues found.</p>
        )}
      </IssueBlock>

      {/* Images missing alt text */}
      <IssueBlock
        title="Images Missing Alt Text"
        count={accessibilityChecks.images_missing_alt_count}
      >
        {accessibilityChecks.images_missing_alt.length > 0 ? (
          <>
            <WCAGNote
              wcag={accessibilityChecks.images_missing_alt[0].wcag}
              wcagLevel={accessibilityChecks.images_missing_alt[0].wcag_level}
              explanation={accessibilityChecks.images_missing_alt[0].explanation}
            />

            <ul>
              {accessibilityChecks.images_missing_alt.map((item, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  {item.src}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No images missing alt text found.</p>
        )}
      </IssueBlock>
    </section>
  );
}