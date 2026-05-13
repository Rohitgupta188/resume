"use client";

import React from "react";

interface CustomSection {
  title: string;
  items: string[];
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM SECTIONS RENDERER
   Shared across all preview templates. Renders user-defined
   sections (Hobbies, Key Interests, etc.) at the bottom.

   Props:
     sections   - the customSections array from content
     headingCls - Tailwind classes for the section <h2>
     itemCls    - Tailwind classes for each item chip/text
     variant    - "chips" (badge-like) | "bullets" | "inline"
   ═══════════════════════════════════════════════════════════════ */

interface CustomSectionsProps {
  sections?: CustomSection[];
  headingCls?: string;
  itemCls?: string;
  variant?: "chips" | "bullets" | "inline" | "vertical";
  accentColor?: string;
  renderTitle?: (title: string) => React.ReactNode;
  scale?: number;
}

export function CustomSectionsBlock({
  sections,
  headingCls = "text-[9pt] font-bold uppercase tracking-widest text-gray-500 mb-2",
  itemCls = "text-gray-700",
  variant = "chips",
  accentColor,
  renderTitle,
  scale = 1,
}: CustomSectionsProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((sec, i) => {
        if (!sec.title || !sec.items?.length) return null;
        return (
          <section key={i} className="custom-section-block break-inside-avoid">
            {renderTitle ? (
              renderTitle(sec.title)
            ) : (
              <h2
                className={headingCls}
                style={accentColor ? { color: accentColor } : undefined}
              >
                {sec.title}
              </h2>
            )}

            {variant === "chips" && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: `${6 * scale}px`,
                }}
              >
                {sec.items.map((item, j) => (
                  <span
                    key={j}
                    className={`bg-gray-100 ${itemCls} border border-gray-200 whitespace-pre-wrap rounded font-bold`}
                    style={{
                      fontSize: `${9 * scale}pt`,
                      padding: `${2 * scale}px ${8 * scale}px`,
                      lineHeight: 1.35,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {variant === "bullets" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${4 * scale}px`,
                }}
              >
                {sec.items.map((item, j) => (
                  <div
                    key={j}
                    className={`${itemCls} whitespace-pre-wrap font-bold`}
                    style={{
                      display: "flex",
                      gap: `${8 * scale}px`,
                      fontSize: `${9.5 * scale}pt`,
                      lineHeight: 1.6,
                    }}
                  >
                    <span
                      className={`${itemCls} shrink-0`}
                      style={{
                        fontSize: `${10 * scale}pt`,
                      }}
                    >
                      •
                    </span>

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {variant === "inline" && (
              <div
                className={`${itemCls} whitespace-pre-wrap font-bold`}
                style={{
                  fontSize: `${9.5 * scale}pt`,
                  lineHeight: 1.6,
                }}
              >
                {sec.items.join(" • ")}
              </div>
            )}

            {variant === "vertical" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${4 * scale}px`,
                }}
              >
                {sec.items.map((item, j) => (
                  <div
                    key={j}
                    className={`font-bold ${itemCls} whitespace-pre-wrap`}
                    style={{
                      fontSize: `${9.5 * scale}pt`,
                      lineHeight: 1.3,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
