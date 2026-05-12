"use client";

// ContrastIssuesSection.tsx
// This component displays low contrast text issues.
// The WCAG rule is shown once for the whole issue group,
// instead of repeating under every contrast item.

import type { ContrastIssue } from "../app/page";
import IssueBlock from "./IssueBlock";

type ContrastIssuesSectionProps = {
  contrastIssueCount: number;
  contrastIssues: ContrastIssue[];
};

export default function ContrastIssuesSection({
  contrastIssueCount,
  contrastIssues,
}: ContrastIssuesSectionProps) {
  return (
    <section style={{ marginBottom: "25px" }}>
      <h2>Contrast Issues</h2>

      <IssueBlock title="Low Contrast Text" count={contrastIssueCount}>
        {contrastIssues.length > 0 ? (
          <>
            {/* WCAG note appears once for the group */}
            {contrastIssues[0].wcag && (
              <div
                style={{
                  marginBottom: "14px",
                  padding: "9px 11px",
                  backgroundColor: "#fff7ed",
                  border: "1px solid #fed7aa",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "#7c2d12",
                }}
              >
                <strong>Possible WCAG issue:</strong> {contrastIssues[0].wcag}
                {contrastIssues[0].wcag_level && (
                  <> — {contrastIssues[0].wcag_level}</>
                )}

                {contrastIssues[0].explanation && (
                  <div style={{ marginTop: "4px" }}>
                    {contrastIssues[0].explanation}
                  </div>
                )}
              </div>
            )}

            <ul>
              {contrastIssues.map((issue, index) => (
                <li key={index} style={{ marginBottom: "16px" }}>
                  <div>
                    <strong>Text:</strong> {issue.text}
                  </div>
                  <div>
                    <strong>Text Color:</strong> {issue.color}
                  </div>
                  <div>
                    <strong>Background:</strong> {issue.background_color}
                  </div>
                  <div>
                    <strong>Contrast Ratio:</strong> {issue.contrast_ratio}
                  </div>
                  <div>
                    <strong>Required Ratio:</strong> {issue.required_ratio}
                  </div>
                  <div>
                    <strong>Font Size:</strong> {issue.font_size}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No contrast issues found.</p>
        )}
      </IssueBlock>
    </section>
  );
}