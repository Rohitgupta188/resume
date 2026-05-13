"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";
import { renderSidebarSection } from "./SidebarSections";

/* ─────────────────────────────────────────────────────────────
   TECH — Developer-focused. Monospaced accents, cyan branding.
   Left main column, right sidebar. High density.
───────────────────────────────────────────────────────────── */

const DEFAULT_TECH_BLUE = "#0891b2";

export function TechPreview({
  content,
  isPrint = false,
}: {
  content: any;
  isPrint?: boolean;
}) {
  const safeContent = content || {};
  const personalInfo = safeContent.personalInfo || {};
  const summary = safeContent.summary || "";
  const experience = safeContent.experience || [];
  const education = safeContent.education || [];
  const skills = safeContent.skills || [];
  const projects = safeContent.projects || [];
  const certifications = safeContent.certifications || [];
  const languages = safeContent.languages || [];
  const customSections = safeContent.customSections || [];
  const themeColor = safeContent.themeColor || DEFAULT_TECH_BLUE;

  const FONT_SCALES: Record<string, number> = {
    small: 0.9,
    normal: 1,
    large: 1.1,
  };
  const scale = FONT_SCALES[safeContent.fontSize || "normal"] || 1;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="font-bold uppercase tracking-widest mb-[10px]"
      style={{
        color: themeColor,
        fontFamily: "'Calibri', 'Inter', sans-serif",
        fontSize: `${11 * scale}pt`,
      }}
    >
      &gt; {children}
    </h2>
  );

  const sectionOrder = safeContent.sectionOrder || [
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "certifications",
    "languages",
    "customSections",
  ];

  const SIDEBAR_IDS = [
    "skills",
    "education",
    "certifications",
    "languages",
    "customSections",
  ];
  const MAIN_IDS = ["summary", "experience", "projects"];

  const sidebarOrder = sectionOrder.filter((id: string) =>
    SIDEBAR_IDS.includes(id),
  );
  const mainOrder = sectionOrder.filter((id: string) => MAIN_IDS.includes(id));

  const renderMainSection = (id: string) => {
    switch (id) {
      case "summary":
        return (
          summary && (
            <section key="summary">
              <SectionTitle> profile</SectionTitle>
              <p
                className="leading-[1.6] text-[#374151]"
                style={{ fontSize: `${9.5 * scale}pt`, textAlign: "justify" }}
              >
                {summary}
              </p>
            </section>
          )
        );
      case "experience":
        return (
          experience.length > 0 && (
            <section key="experience">
              <SectionTitle>experience</SectionTitle>
              <div className="space-y-[14pt]">
                {experience.map((exp: any, i: number) => (
                  <div
                    className="experience-item pb-[10pt] border-b border-[#e5e7eb] last:border-b-0"
                    key={i}
                  >
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3
                        className="font-bold text-[#111827]"
                        style={{ fontSize: `${10.5 * scale}pt` }}
                      >
                        {exp.role}
                      </h3>
                      <span
                        className="text-[#6b7280] font-mono"
                        style={{ fontSize: `${8 * scale}pt` }}
                      >
                        {exp.duration}
                      </span>
                    </div>
                    <p
                      className="font-semibold text-[#374151] mb-[6px]"
                      style={{ fontSize: `${9.5 * scale}pt` }}
                    >
                      {exp.company}
                    </p>
                    {exp.bullets?.length > 0 && (
                      <ul className="space-y-[4px]">
                        {exp.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="flex gap-[8px] text-[#4b5563] leading-normal"
                            style={{ fontSize: `${9 * scale}pt` }}
                          >
                            <span
                              className="mt-[2px]"
                              style={{
                                color: themeColor,
                                fontFamily: "monospace",
                                fontSize: `${8 * scale}pt`,
                              }}
                            >
                              ~
                            </span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        );
      case "projects":
        return (
          projects.length > 0 && (
            <section key="projects">
              <SectionTitle>projects</SectionTitle>
              <div className="space-y-2">
                {projects.map((proj: any, i: number) => (
                  <div
                    className="project-item pb-[10pt] border-b border-[#e5e7eb] last:border-b-0"
                    key={i}
                  >
                    <div className="flex justify-between items-baseline mb-[6px]">
                      <h3
                        className="font-bold text-[#111827]"
                        style={{ fontSize: `${10 * scale}pt` }}
                      >
                        {proj.title}
                      </h3>
                      <ResumeLink
                        href={proj.link}
                        className="font-mono ml-2 shrink-0"
                        style={{
                          color: themeColor,
                          fontSize: `${8 * scale}pt`,
                        }}
                      />
                    </div>
                    {proj.techStack && (
                      <p
                        className="font-mono mb-[8px] text-[#6b7280]"
                        style={{
                          fontSize: `${8 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        [
                        {Array.isArray(proj.techStack)
                          ? proj.techStack.join(", ")
                          : proj.techStack}
                        ]
                      </p>
                    )}
                    {proj.description && (
                      <p
                        className="text-[#374151] mb-[8px] leading-[1.4] font-bold"
                        style={{
                          fontSize: `${9 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {proj.description}
                      </p>
                    )}
                    {proj.bullets?.length > 0 && (
                      <ul className="space-y-[8px]">
                        {proj.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="flex gap-[8px] text-[#4b5563] leading-[1.4]"
                            style={{
                              fontSize: `${9 * scale}pt`,
                              textAlign: "justify",
                            }}
                          >
                            <span
                              className="mt-[2px]"
                              style={{
                                color: themeColor,
                                fontFamily: "monospace",
                                fontSize: `${8 * scale}pt`,
                                textAlign: "justify",
                              }}
                            >
                              ~
                            </span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-[#f3f4f6] flex flex-col items-center ${
        isPrint ? "" : "py-6"
      }`}
      style={{ zoom: isPrint ? 1 : undefined }}
    >
      <div
        className="resume-page flex flex-col text-[#1f2937]"
        style={{
          width: "210mm",
          minHeight: "290mm",
          padding: "16pt 24pt",
          background: "white",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        {/* ── HEADER ── */}
        <header
          className="flex justify-between items-end border-b-2 pb-[16pt] mb-[20pt]"
          style={{ borderBottomColor: themeColor }}
        >
          <div className="space-y-[4px]">
            <h1
              className="font-black uppercase tracking-tight text-[#111827] leading-none"
              style={{ fontSize: `${26 * scale}pt` }}
            >
              {personalInfo.name || "DEVELOPER NAME"}
            </h1>
            <div
              className="flex gap-[12px] font-bold"
              style={{ color: themeColor, fontSize: `${9 * scale}pt` }}
            >
              {personalInfo.portfolio && (
                <ResumeLink
                  href={personalInfo.portfolio}
                  style={{ color: themeColor }}
                >
                  {cleanUrl(personalInfo.portfolio)}
                </ResumeLink>
              )}
              {personalInfo.linkedin && (
                <ResumeLink
                  href={personalInfo.linkedin}
                  style={{ color: themeColor }}
                >
                  {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
                </ResumeLink>
              )}
            </div>
          </div>
          <div
            className="text-right flex flex-col gap-[2px] text-[#4b5563] font-mono"
            style={{ fontSize: `${8.5 * scale}pt` }}
          >
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>

        <div className="flex gap-[24pt] flex-1">
          {/* ── MAIN COLUMN ── */}
          <main className="w-[65%] space-y-[18pt]">
            {mainOrder.map((id: string) => renderMainSection(id))}
          </main>

          {/* ── SIDEBAR ── */}
          <aside className="w-[35%] space-y-[18pt] pl-[16pt] border-l border-[#e5e7eb]">
            {sidebarOrder.map((id: string) =>
              renderSidebarSection({
                id,
                scale,
                SectionTitle,
                variant: "tech",

                data: {
                  skills,
                  education,
                  certifications,
                  languages,
                  customSections,
                },
              }),
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
