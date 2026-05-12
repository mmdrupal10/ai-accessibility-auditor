"use client";

// Displays sample headings, links, normal images, and CSS background images.

import type {
  BackgroundImageItem,
  HeadingItem,
  ImageItem,
  LinkItem,
} from "../app/page";

type SampleContentSectionProps = {
  headings: HeadingItem[];
  links: LinkItem[];
  images: ImageItem[];
  backgroundImages?: BackgroundImageItem[];
};

export default function SampleContentSection({
  headings,
  links,
  images,
  backgroundImages = [],
}: SampleContentSectionProps) {
  return (
    <>
      {/* Sample headings section */}
      <section style={{ marginBottom: "25px" }}>
        <h2>Sample Headings</h2>
        {headings.length > 0 ? (
          <ul>
            {headings.map((heading, index) => (
              <li key={index}>
                <strong>{heading.tag.toUpperCase()}:</strong> {heading.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>No headings found.</p>
        )}
      </section>

      {/* Sample links section */}
      <section style={{ marginBottom: "25px" }}>
        <h2>Sample Links</h2>
        {links.length > 0 ? (
          <ul>
            {links.map((link, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                <strong>{link.text}</strong>
                <br />
                <span style={{ color: "#6b7280" }}>{link.href}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No links found.</p>
        )}
      </section>

      {/* Normal <img> tags */}
      <section style={{ marginBottom: "25px" }}>
        <h2>Sample Images</h2>
        {images.length > 0 ? (
          <ul>
            {images.map((image, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <div>
                  <strong>Source:</strong> {image.src}
                </div>
                <div>
                  <strong>Alt:</strong> {image.alt}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No normal image tags found.</p>
        )}
      </section>

      {/* CSS background images */}
      <section style={{ marginBottom: "25px" }}>
        <h2>Background Images</h2>
        {backgroundImages.length > 0 ? (
          <ul>
            {backgroundImages.map((image, index) => (
              <li key={index} style={{ marginBottom: "12px" }}>
                <div>
                  <strong>Source:</strong> {image.src}
                </div>
                <div>
                  <strong>Element:</strong> {image.element}
                </div>
                <div>
                  <strong>Size:</strong> {image.width}px × {image.height}px
                </div>
                {image.text_context && (
                  <div>
                    <strong>Nearby text:</strong> {image.text_context}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No CSS background images found.</p>
        )}
      </section>
    </>
  );
}