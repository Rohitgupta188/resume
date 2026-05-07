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
  variant?: "chips" | "bullets" | "inline" | "vertical";
  accentColor?: string;
  renderTitle?: (title: string) => React.ReactNode;
}

export function CustomSectionsBlock({
  sections,
  headingCls = "text-[9pt] font-bold uppercase tracking-widest text-gray-500 mb-2",
  variant = "chips",
  accentColor,
  renderTitle,
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
              <div className="flex flex-wrap gap-1.5">
                {sec.items.map((item, j) => (
                  <span
                    key={j}
                    className="text-[9pt] px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200 whitespace-pre-wrap"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {variant === "bullets" && (
              <ul className="space-y-1">
                {sec.items.map((item, j) => (
                  <li key={j} className="text-[9.5pt] text-gray-700 flex gap-2 whitespace-pre-wrap leading-relaxed">
                    <span className="text-gray-300 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {variant === "inline" && (
              <div className="text-[9.5pt] text-gray-700 leading-relaxed whitespace-pre-wrap">
                {sec.items.join(" • ")}
              </div>
            )}

            {variant === "vertical" && (
              <div className="space-y-[4px]">
                {sec.items.map((item, j) => (
                  <div key={j} className="text-[9.5pt] text-gray-700 whitespace-pre-wrap leading-tight">
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
