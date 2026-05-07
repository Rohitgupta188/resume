"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";

/* ─────────────────────────────────────────────────────────────
   TECH — Developer-focused. Monospaced accents, cyan branding.
   Left main column, right sidebar. High density.
───────────────────────────────────────────────────────────── */

const DEFAULT_TECH_BLUE = "#0891b2";

export function TechPreview({ content }: { content: any }) {
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
      className="text-[9.5pt] font-bold uppercase tracking-widest mb-[10px]"
      style={{
        color: themeColor,
        fontFamily: "'Fira Code', 'Courier New', monospace",
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

  const renderSidebarSection = (id: string) => {
    switch (id) {
      case "skills":
        return (
          skills.length > 0 && (
            <section key="skills">
              <SectionTitle>skills</SectionTitle>
              <div className="space-y-[6px]">
                {skills.map((skill: string, i: number) => (
                  <div
                    key={i}
                    className="px-[6px] py-[3px] bg-[#f3f4f6] text-[#111827] text-[8.5pt] font-mono rounded-sm border border-[#d1d5db]"
                  >
                    {skill.includes(":") ? (
                      <>
                        <span className="font-bold">
                          {skill.split(":")[0]}:
                        </span>
                        <span>{skill.split(":").slice(1).join(":")}</span>
                      </>
                    ) : (
                      skill
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        );
      case "education":
        return (
          education.length > 0 && (
            <section key="education">
              <SectionTitle>education</SectionTitle>
              <div className="space-y-[10pt]">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <p className="font-bold text-[9.5pt] text-[#111827] leading-tight">
                      {edu.school}
                    </p>
                    <p className="text-[9pt] text-[#374151] mt-[2px]">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </p>
                    <p className="text-[8pt] font-mono text-[#6b7280] mt-[2px]">
                      {edu.year}
                      {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                    </p>
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
              <SectionTitle>certs</SectionTitle>
              <div className="space-y-[8pt]">
                {certifications.map((cert: any, i: number) => (
                  <div key={i}>
                    <p className="font-bold text-[9pt] text-[#111827] leading-tight">
                      {cert.name}
                    </p>
                    <p className="text-[8.5pt] text-[#4b5563] mt-[2px]">
                      {cert.issuer}
                      {cert.date ? ` • ${cert.date}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )
        );
      case "languages":
        return (
          languages.length > 0 && (
            <section key="languages">
              <SectionTitle>languages</SectionTitle>
              <div className="space-y-[4px]">
                {languages.map((l: any, i: number) => (
                  <div
                    key={i}
                    className="text-[9pt] text-[#374151] flex justify-between font-mono"
                  >
                    <span className="font-semibold">{l.language}</span>
                    <span className="text-[#6b7280]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )
        );
      case "customSections":
        return (
          customSections.length > 0 && (
            <CustomSectionsBlock
              key="customSections"
              sections={customSections}
              variant="vertical"
              renderTitle={(title) => <SectionTitle>{title}</SectionTitle>}
            />
          )
        );
      default:
        return null;
    }
  };

  const renderMainSection = (id: string) => {
    switch (id) {
      case "summary":
        return (
          summary && (
            <section key="summary">
              <SectionTitle>profile</SectionTitle>
              <p className="text-[9.5pt] leading-[1.6] text-[#374151]">
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
                    key={i}
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3 className="font-bold text-[10.5pt] text-[#111827]">
                        {exp.role}
                      </h3>
                      <span className="text-[8pt] text-[#6b7280] font-mono">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-[9.5pt] font-semibold text-[#374151] mb-[6px]">
                      {exp.company}
                    </p>
                    {exp.bullets?.length > 0 && (
                      <ul className="space-y-[4px]">
                        {exp.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="flex gap-[8px] text-[9pt] text-[#4b5563] leading-normal"
                          >
                            <span
                              className="text-[8pt] mt-[2px]"
                              style={{
                                color: themeColor,
                                fontFamily: "monospace",
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
              <div className="space-y-[14pt]">
                {projects.map((proj: any, i: number) => (
                  <div
                    key={i}
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3 className="font-bold text-[10pt] text-[#111827]">
                        {proj.title}
                      </h3>
                      <ResumeLink
                        href={proj.link}
                        className="text-[8pt] font-mono ml-2 shrink-0"
                        style={{ color: themeColor }}
                      />
                    </div>
                    {proj.techStack && (
                      <p className="text-[8pt] font-mono mb-[4px] text-[#6b7280]">
                        [
                        {Array.isArray(proj.techStack)
                          ? proj.techStack.join(", ")
                          : proj.techStack}
                        ]
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-[9pt] text-[#374151] mb-[4px] leading-[1.4]">
                        {proj.description}
                      </p>
                    )}
                    {proj.bullets?.length > 0 && (
                      <ul className="space-y-[3px]">
                        {proj.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="flex gap-[8px] text-[9pt] text-[#4b5563] leading-[1.4]"
                          >
                            <span
                              className="text-[8pt] mt-[2px]"
                              style={{
                                color: themeColor,
                                fontFamily: "monospace",
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
      className="min-h-full bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        style={{
          zoom: scale,
        }}
        className="px-[54pt] py-[36pt] flex flex-col text-[#1f2937]"
      >
        {/* ── HEADER ── */}
        <header
          className="flex justify-between items-end border-b-2 pb-[16pt] mb-[20pt]"
          style={{ borderBottomColor: themeColor }}
        >
          <div className="space-y-[4px]">
            <h1 className="text-[26pt] font-black uppercase tracking-tight text-[#111827] leading-none">
              {personalInfo.name || "DEVELOPER NAME"}
            </h1>
            <div
              className="flex gap-[12px] text-[9pt] font-bold"
              style={{ color: themeColor }}
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
          <div className="text-right flex flex-col gap-[2px] text-[8.5pt] text-[#4b5563] font-mono">
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
            {sidebarOrder.map((id: string) => renderSidebarSection(id))}
          </aside>
        </div>
      </div>
    </div>
  );
}
