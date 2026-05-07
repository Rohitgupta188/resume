"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";

/* ─────────────────────────────────────────────────────────────
   EXECUTIVE — Authoritative, dense, right-sidebar layout.
   Slate/Dark Blue accents, high contrast headers.
───────────────────────────────────────────────────────────── */

const DEFAULT_SLATE_DARK = "#0f172a";
const SLATE_LIGHT = "#f1f5f9";

export function ExecutivePreview({ content }: { content: any }) {
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

  const SectionTitle = ({ children, isDark = false }: { children: React.ReactNode, isDark?: boolean }) => (
    <h2 className={`text-[10pt] font-black uppercase tracking-[0.2em] mb-[12px] flex items-center gap-[8px] ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>
      {children}
      <div className={`h-[2px] flex-1 ${isDark ? 'bg-[#334155]' : 'bg-[#e2e8f0]'}`} />
    </h2>
  );

  const sectionOrder = safeContent.sectionOrder || [
    "summary", "experience", "education", "projects", "skills", "certifications", "languages", "customSections"
  ];

  const SIDEBAR_IDS = ["skills", "education", "certifications", "languages", "customSections"];
  const MAIN_IDS = ["summary", "experience", "projects"];

  const sidebarOrder = sectionOrder.filter((id: string) => SIDEBAR_IDS.includes(id));
  const mainOrder = sectionOrder.filter((id: string) => MAIN_IDS.includes(id));

  const renderSidebarSection = (id: string) => {
    switch (id) {
      case "skills":
        return skills.length > 0 && (
          <section key="skills">
            <SectionTitle>Core Competencies</SectionTitle>
            <div className="flex flex-col gap-[6px]">
              {skills.map((skill: string, i: number) => (
                <div key={i} className="text-[9pt] text-[#334155] leading-tight border-b border-[#f1f5f9] pb-[4px]">
                  {skill.includes(":") ? (
                    <>
                      <span className="font-bold text-[#0f172a]">{skill.split(":")[0]}:</span>
                      <span>{skill.split(":").slice(1).join(":")}</span>
                    </>
                  ) : (
                    skill
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "education":
        return education.length > 0 && (
          <section key="education">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-[10pt]">
              {education.map((edu: any, i: number) => (
                <div key={i}>
                  <h3 className="font-bold text-[9.5pt] text-[#0f172a] leading-tight">{edu.school}</h3>
                  <p className="text-[9pt] text-[#475569] mt-[2px]">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</p>
                  <p className="text-[8.5pt] font-semibold text-[#94a3b8] mt-[2px]">{edu.year}{edu.gpa ? ` • GPA: ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return certifications.length > 0 && (
          <section key="certifications">
            <SectionTitle>Credentials</SectionTitle>
            <div className="space-y-[8pt]">
              {certifications.map((cert: any, i: number) => (
                <div key={i}>
                  <h3 className="font-bold text-[9pt] text-[#0f172a] leading-tight">{cert.name}</h3>
                  <p className="text-[8.5pt] text-[#64748b] mt-[2px]">{cert.issuer}{cert.date ? ` • ${cert.date}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case "languages":
        return languages.length > 0 && (
          <section key="languages">
            <SectionTitle>Languages</SectionTitle>
            <div className="space-y-[6px]">
              {languages.map((l: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-[9pt] border-b border-[#f1f5f9] pb-[4px]">
                  <span className="font-semibold text-[#334155]">{l.language}</span>
                  <span className="text-[8.5pt] text-[#94a3b8]">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        );
      case "customSections":
        return customSections.length > 0 && (
          <CustomSectionsBlock
            key="customSections"
            sections={customSections}
            variant="vertical"
            renderTitle={(title) => <SectionTitle>{title}</SectionTitle>}
          />
        );
      default:
        return null;
    }
  };

  const renderMainSection = (id: string) => {
    switch (id) {
      case "summary":
        return summary && (
          <section key="summary">
            <SectionTitle>Executive Summary</SectionTitle>
            <p className="text-[9.5pt] leading-[1.6] text-[#334155]">{summary}</p>
          </section>
        );
      case "experience":
        return experience.length > 0 && (
          <section key="experience">
            <SectionTitle>Professional Experience</SectionTitle>
            <div className="space-y-[16pt]">
              {experience.map((exp: any, i: number) => (
                <div key={i} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline mb-[2px]">
                    <h3 className="font-bold text-[11pt] text-[#0f172a]">{exp.role}</h3>
                    <span className="text-[8.5pt] font-semibold text-[#64748b] bg-[#f8fafc] px-[6px] py-[2px] rounded uppercase tracking-wider">{exp.duration}</span>
                  </div>
                  <div className="text-[9pt] font-extrabold text-[#475569] mb-[6px] tracking-wide uppercase">{exp.company}</div>
                  {exp.bullets?.length > 0 && (
                    <ul className="space-y-[4px]">
                      {exp.bullets.map((b: string, j: number) => (
                        <li key={j} className="text-[9.5pt] text-[#334155] leading-normal pl-[12px] relative">
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
        );
      case "projects":
        return projects.length > 0 && (
          <section key="projects">
            <SectionTitle>Strategic Initiatives</SectionTitle>
            <div className="space-y-[12pt]">
              {projects.map((proj: any, i: number) => (
                <div key={i} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline mb-[2px]">
                    <h3 className="font-bold text-[10pt] text-[#0f172a]">{proj.title}</h3>
                    <ResumeLink href={proj.link} className="text-[8pt] font-medium ml-2 shrink-0 text-[#64748b]" />
                  </div>
                  {proj.description && <p className="text-[9.5pt] text-[#475569] mb-[4px] leading-[1.4]">{proj.description}</p>}
                  {proj.bullets?.length > 0 && (
                    <ul className="space-y-[3px]">
                      {proj.bullets.map((b: string, j: number) => (
                        <li key={j} className="text-[9pt] text-[#334155] leading-[1.4] pl-[12px] relative">
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        className="min-h-full flex flex-col font-sans text-[#1e293b]"
        style={{
          zoom: scale,
        }}
      >

      {/* ── HEADER ── */}
      <header className="px-[54pt] py-[36pt] flex flex-col gap-[12px]" style={{ backgroundColor: themeColor, color: "white" }}>
        <div className="flex justify-between items-end">
          <div className="space-y-[4px]">
            <h1 className="text-[26pt] font-extrabold tracking-tight leading-none uppercase">
              {personalInfo.name || "YOUR NAME"}
            </h1>
            <p className="text-[11pt] font-semibold tracking-widest text-[#94a3b8] uppercase">
              {experience[0]?.role || "Executive Leader"}
            </p>
          </div>
          <div className="text-right text-[8.5pt] text-[#cbd5e1] space-y-[3px] leading-tight shrink-0 ml-[20pt]">
            <p>{personalInfo.location}</p>
            <p className="text-white font-semibold">{personalInfo.email}</p>
            <p>{personalInfo.phone}</p>
            <div className="flex justify-end gap-[8px] mt-[4px]">
              {personalInfo.linkedin && (
                <ResumeLink href={personalInfo.linkedin} className="font-bold text-[#38bdf8] text-[8.5pt]">
                  {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
                </ResumeLink>
              )}
              {personalInfo.portfolio && (
                <ResumeLink href={personalInfo.portfolio} className="font-bold text-[#38bdf8] text-[8.5pt]">
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
          {sidebarOrder.map((id: string) => renderSidebarSection(id))}
        </aside>
      </div>
    </div>
    </div>
  );
}
