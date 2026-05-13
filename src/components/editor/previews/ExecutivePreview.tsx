"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";
import { renderSidebarSection } from "./SidebarSections";

/* ─────────────────────────────────────────────────────────────
   EXECUTIVE — Authoritative, dense, right-sidebar layout.
   Slate/Dark Blue accents, high contrast headers.
───────────────────────────────────────────────────────────── */

const DEFAULT_SLATE_DARK = "#0f172a";
const SLATE_LIGHT = "#f1f5f9";

export function ExecutivePreview({
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
  const themeColor = safeContent.themeColor || DEFAULT_SLATE_DARK;

  const FONT_SCALES: Record<string, number> = {
    small: 0.9,
    normal: 1,
    large: 1.1,
  };
  const scale = FONT_SCALES[safeContent.fontSize || "normal"] || 1;

  const SectionTitle = ({
    children,
    isDark = false,
  }: {
    children: React.ReactNode;
    isDark?: boolean;
  }) => (
    <h2
      className={`font-black uppercase tracking-[0.2em] mb-[12px] flex items-center gap-[8px] ${isDark ? "text-white" : "text-[#0f172a]"}`}
      style={{ fontSize: `${10 * scale}pt` }}
    >
      {children}
      <div
        className={`h-[2px] flex-1 ${isDark ? "bg-[#334155]" : "bg-[#e2e8f0]"}`}
      />
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
              <SectionTitle>Executive Summary</SectionTitle>
              <p
                className="leading-[1.6] text-[#334155] font-bold"
                style={{ fontSize: `${10.3 * scale}pt`, textAlign: "justify" }}
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
              <SectionTitle>Professional Experience</SectionTitle>
              <div className="space-y-[16pt]">
                {experience.map((exp: any, i: number) => (
                  <div key={i} className="experience-item">
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3
                        className="font-bold text-[#0f172a]"
                        style={{ fontSize: `${10.5 * scale}pt` }}
                      >
                        {exp.role}
                      </h3>
                      <span
                        className="font-semibold text-[#64748b] bg-[#f8fafc] px-[6px] py-[2px] rounded uppercase tracking-wider"
                        style={{ fontSize: `${8.5 * scale}pt` }}
                      >
                        {exp.duration}
                      </span>
                    </div>
                    <div
                      className="font-extrabold text-[#475569] mb-[6px] tracking-wide uppercase"
                      style={{ fontSize: `${9 * scale}pt` }}
                    >
                      {exp.company}
                    </div>
                    {exp.bullets?.length > 0 && (
                      <ul className="space-y-[4px]">
                        {exp.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="text-[#334155] leading-normal pl-[12px] relative"
                            style={{
                              fontSize: `${9.5 * scale}pt`,
                              textAlign: "justify",
                            }}
                          >
                            <span className="absolute left-0 top-[6px] h-[4px] w-[4px] bg-[#94a3b8]" />
                            {b}
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
              <SectionTitle>Strategic Initiatives</SectionTitle>
              <div className="space-y-[12pt]">
                {projects.map((proj: any, i: number) => (
                  <div
                    key={i}
                    className="project-item pb-[10pt] border-b border-[#e5e7eb] last:border-b-0"
                  >
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3
                        className="font-bold text-[#0f172a]"
                        style={{ fontSize: `${11.3 * scale}pt` }}
                      >
                        {proj.title}
                      </h3>
                      <ResumeLink
                        href={proj.link}
                        className="ml-2 shrink-0 text-[#64748b]"
                        style={{ fontSize: `${8 * scale}pt` }}
                      />
                    </div>
                    {proj.description && (
                      <p
                        className="text-[#475569] mb-[8px] mt-1.5 leading-[1.4] font-bold"
                        style={{
                          fontSize: `${10 * scale}pt`,
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
                            className="text-[#334155] leading-[1.4] pl-[12px] relative"
                            style={{
                              fontSize: `${9.5 * scale}pt`,
                              textAlign: "justify",
                            }}
                          >
                            <span className="absolute left-0 top-[6px] h-[3px] w-[3px] bg-[#94a3b8]" />
                            {b}
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
        className="resume-page min-h-full flex flex-col font-sans text-[#1e293b]"
        style={{
          width: "210mm",
          minHeight:  "290mm",
          background: "white",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        {/* ── HEADER ── */}
        <header
          className="px-[34pt] py-[36pt] flex flex-col gap-[12px]"
          style={{ backgroundColor: themeColor, color: "white" }}
        >
          <div className="flex justify-between items-end">
            <div className="space-y-[4px]">
              <h1
                className="font-extrabold tracking-tight leading-none uppercase"
                style={{ fontSize: `${26 * scale}pt` }}
              >
                {personalInfo.name || "YOUR NAME"}
              </h1>
              <p
                className="font-semibold tracking-widest text-[#94a3b8] uppercase"
                style={{ fontSize: `${11 * scale}pt` }}
              >
                {experience[0]?.role}
              </p>
            </div>
            <div
              className="text-right text-[#cbd5e1] space-y-[3px] leading-tight shrink-0 ml-[20pt]"
              style={{ fontSize: `${8.5 * scale}pt` }}
            >
              <p>{personalInfo.location}</p>
              <p className="text-white font-semibold">{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <div className="flex justify-end gap-[8px] mt-[4px]">
                {personalInfo.linkedin && (
                  <ResumeLink
                    href={personalInfo.linkedin}
                    className="font-bold text-[#38bdf8]"
                    style={{ fontSize: `${8.5 * scale}pt` }}
                  >
                    {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
                  </ResumeLink>
                )}
                {personalInfo.portfolio && (
                  <ResumeLink
                    href={personalInfo.portfolio}
                    className="font-bold text-[#38bdf8]"
                    style={{ fontSize: `${8.5 * scale}pt` }}
                  >
                    {cleanUrl(personalInfo.portfolio) || "Portfolio"}
                  </ResumeLink>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="flex-1 flex px-[54pt] py-[36pt] gap-[24pt]">
          {/* MAIN COLUMN (approx 2/3) */}
          <main className="w-[65%] space-y-[18pt]">
            {mainOrder.map((id: string) => renderMainSection(id))}
          </main>

          {/* SIDEBAR (approx 1/3) */}
          <aside className="w-[35%] space-y-[18pt] pl-[16pt] border-l-2 border-[#f1f5f9]">
            {sidebarOrder.map((id: string) =>
              renderSidebarSection({
                id,
                scale,
                SectionTitle,
                variant: "minimal",
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
