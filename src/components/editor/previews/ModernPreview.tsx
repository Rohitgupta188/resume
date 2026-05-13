"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";
import { renderSidebarSection } from "./SidebarSections";

/* ─────────────────────────────────────────────────────────────
   MODERN — Two-column split layout
   Left sidebar: contact · skills · education · languages
   Right main:   summary · experience · projects · certs
   Accent: Navy #1a3a5c
───────────────────────────────────────────────────────────── */

const DEFAULT_NAVY = "#1a3a5c";

export function ModernPreview({
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
  const themeColor = safeContent.themeColor || DEFAULT_NAVY;

  const FONT_SCALES: Record<string, number> = {
    small: 0.9,
    normal: 1,
    large: 1.1,
  };
  const scale = FONT_SCALES[safeContent.fontSize || "normal"] || 1;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      style={{
        color: themeColor,
        borderBottomColor: themeColor,
        fontSize: `${8.5 * scale}pt`,
      }}
      className="font-extrabold uppercase tracking-[0.18em] border-b pb-[3px] mb-[8px]"
    >
      {children}
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

  const SIDEBAR_IDS = ["skills", "education", "languages", "customSections"];
  const MAIN_IDS = ["summary", "experience", "projects", "certifications"];

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
              <SectionTitle>Professional Summary</SectionTitle>
              <p
                className="text-[#374151] leading-[1.6] font-bold"
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
              <SectionTitle>Work Experience</SectionTitle>
              <div className="space-y-[12pt]">
                {experience.map((exp: any, i: number) => (
                  <div key={i} className="experience-item">
                    <div className="flex justify-between items-baseline">
                      <h3
                        className="font-bold text-[#0f172a]"
                        style={{ fontSize: `${10.5 * scale}pt` }}
                      >
                        {exp.role}
                      </h3>
                      <span
                        className="text-[#6b7280] font-medium shrink-0 ml-2"
                        style={{ fontSize: `${8 * scale}pt` }}
                      >
                        {exp.duration}
                      </span>
                    </div>
                    <p
                      className="font-semibold mt-px mb-[4px]"
                      style={{
                        color: themeColor,
                        fontSize: `${8.5 * scale}pt`,
                      }}
                    >
                      {exp.company}
                    </p>
                    {exp.bullets?.length > 0 && (
                      <ul className="space-y-[4px] pl-[2px]">
                        {exp.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="text-[#4b5563] leading-normal"
                            style={{
                              paddingLeft: "2px",
                              fontSize: `${9.5 * scale}pt`,
                              textAlign: "justify",
                            }}
                          >
                            <span
                              style={{
                                color: themeColor,
                                marginRight: "6px",
                                fontWeight: 700,
                              }}
                            >
                              {" "}
                              •{" "}
                            </span>
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
              <SectionTitle>Projects</SectionTitle>

              <div className="space-y-[14pt]">
                {projects.map((proj: any, i: number) => (
                  <div
                    key={i}
                    className="pb-[10pt] border-b border-[#e5e7eb] last:border-b-0 project-item"
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3
                          className="font-bold text-[#0f172a] leading-tight"
                          style={{ fontSize: `${11.3 * scale}pt` }}
                        >
                          {proj.title}
                        </h3>

                        {proj.techStack && (
                          <p
                            className="font-semibold mt-[2px]"
                            style={{
                              color: themeColor,
                              fontSize: `${8 * scale}pt`,
                            }}
                          >
                            {proj.techStack}
                          </p>
                        )}
                      </div>

                      {proj.link && (
                        <ResumeLink
                          href={proj.link}
                          className="shrink-0 mt-px"
                          style={{
                            color: themeColor,
                            fontSize: `${7.5 * scale}pt`,
                          }}
                        >
                          View Project
                        </ResumeLink>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    {proj.description && (
                      <p
                        className="text-[#4b5563] leading-[1.55] mt-[6px] font-bold"
                        style={{
                          fontSize: `${10 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {proj.description}
                      </p>
                    )}

                    {/* BULLETS */}
                    {proj.bullets?.length > 0 && (
                      <ul className="mt-[8px] space-y-[8px] pl-[1.5px]">
                        {proj.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="text-[#374151] leading-[1.45]"
                            style={{
                              fontSize: `${9.5 * scale}pt`,
                              textAlign: "justify",
                            }}
                          >
                            <span
                              style={{
                                color: themeColor,
                                marginRight: "6px",
                                fontWeight: 700,
                              }}
                            >
                              •
                            </span>
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
      case "certifications":
        return (
          certifications.length > 0 && (
            <section key="certifications">
              <SectionTitle>Certifications</SectionTitle>
              <div className="space-y-[6px]">
                {certifications.map((cert: any, i: number) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <div>
                      <span
                        className="font-semibold text-[#1e293b]"
                        style={{ fontSize: `${9 * scale}pt` }}
                      >
                        {cert.name}
                      </span>
                      {cert.issuer && (
                        <span
                          className="text-[#6b7280]"
                          style={{ fontSize: `${8 * scale}pt` }}
                        >
                          {" "}
                          · {cert.issuer}
                        </span>
                      )}
                    </div>
                    {cert.date && (
                      <span
                        className="text-[#9ca3af] shrink-0 ml-2"
                        style={{ fontSize: `${7.5 * scale}pt` }}
                      >
                        {cert.date}
                      </span>
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
        className="resume-page flex text-[#1a1a1a]"
        style={{
          width: "210mm",
          minHeight: "290mm",
          background: "white",
          padding: "1pt 15pt",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT SIDEBAR ── */}
        <aside
          className="w-[34%]  flex flex-col gap-[18px] px-[12pt] py-[10pt]"
          style={{ backgroundColor: "#f0f4f8" }}
        >
          {/* NAME BLOCK */}
          <div className="mb-1">
            <h1
              className="font-extrabold leading-[1.05] text-[#0f172a]"
              style={{ fontSize: `${19 * scale}pt` }}
            >
              {(personalInfo.name || "YOUR NAME")
                .split(" ")
                .map((w: string, i: number) => (
                  <span key={i} className={i === 0 ? "block" : "block"}>
                    {w}
                  </span>
                ))}
            </h1>
            {experience[0]?.role && (
              <p
                className="font-semibold tracking-wide mt-[4px]"
                style={{ color: themeColor, fontSize: `${9 * scale}pt` }}
              >
                {experience[0].role}
              </p>
            )}
          </div>

          {/* CONTACT */}
          <div>
            <SectionTitle>Contact</SectionTitle>
            <div
              className="space-y-[5px] text-[#374151]"
              style={{ fontSize: `${8.5 * scale}pt` }}
            >
              {personalInfo.email && (
                <p className="break-all">{personalInfo.email}</p>
              )}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
              {personalInfo.linkedin && (
                <ResumeLink
                  href={personalInfo.linkedin}
                  className="font-medium block"
                  style={{ color: themeColor }}
                >
                  {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
                </ResumeLink>
              )}
              {personalInfo.portfolio && (
                <ResumeLink
                  href={personalInfo.portfolio}
                  className="font-medium block"
                  style={{ color: themeColor }}
                >
                  {cleanUrl(personalInfo.portfolio) || "Portfolio"}
                </ResumeLink>
              )}
            </div>
          </div>

          {sidebarOrder.map((id: string) =>
            renderSidebarSection({
              id,
              scale,
              SectionTitle,
              variant: "modern",
              data: {
                skills,
                education,
                languages,
                customSections,
              },
            }),
          )}
        </aside>

        {/* ── RIGHT MAIN CONTENT ── */}
        <main className="flex-1 pl-[24pt] py-[10pt] space-y-[16pt]">
          {mainOrder.map((id: string) => renderMainSection(id))}
        </main>
      </div>
    </div>
  );
}
