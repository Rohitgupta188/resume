"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";

/* ─────────────────────────────────────────────────────────────
   MODERN — Two-column split layout
   Left sidebar: contact · skills · education · languages
   Right main:   summary · experience · projects · certs
   Accent: Navy #1a3a5c
───────────────────────────────────────────────────────────── */

const DEFAULT_NAVY = "#1a3a5c";

export function ModernPreview({ content }: { content: any }) {
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
      style={{ color: themeColor, borderBottomColor: themeColor }}
      className="text-[8.5pt] font-extrabold uppercase tracking-[0.18em] border-b pb-[3px] mb-[8px]"
    >
      {children}
    </h2>
  );

  const sectionOrder = safeContent.sectionOrder || [
    "summary", "experience", "education", "projects", "skills", "certifications", "languages", "customSections"
  ];

  const SIDEBAR_IDS = ["skills", "education", "languages", "customSections"];
  const MAIN_IDS = ["summary", "experience", "projects", "certifications"];

  const sidebarOrder = sectionOrder.filter((id: string) => SIDEBAR_IDS.includes(id));
  const mainOrder = sectionOrder.filter((id: string) => MAIN_IDS.includes(id));

  const renderSidebarSection = (id: string) => {
    switch (id) {
      case "skills":
        return skills.length > 0 && (
          <div key="skills">
            <SectionTitle>Skills</SectionTitle>
            <div className="space-y-1.5">
              {skills.map((skill: string, i: number) => (
                <div key={i} className="text-xs text-gray-700 leading-snug">
                  {skill.includes(":") ? (
                    <>
                      <span className="font-bold">{skill.split(":")[0]}:</span>
                      <span>{skill.split(":").slice(1).join(":")}</span>
                    </>
                  ) : (
                    skill
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case "education":
        return education.length > 0 && (
          <div key="education">
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-[10px]">
              {education.map((edu: any, i: number) => (
                <div key={i}>
                  <p className="text-[8.5pt] font-bold text-[#1e293b] leading-snug">{edu.school}</p>
                  <p className="text-[8pt] text-[#4b5563] mt-px">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</p>
                  {edu.year && <p className="text-[7.5pt] text-[#6b7280] mt-px">{edu.year}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case "languages":
        return languages.length > 0 && (
          <div key="languages">
            <SectionTitle>Languages</SectionTitle>
            <div className="space-y-[4px]">
              {languages.map((l: any, i: number) => (
                <div key={i} className="flex justify-between text-[8.5pt]">
                  <span className="font-medium text-[#374151]">{l.language}</span>
                  <span className="text-[#6b7280] italic">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
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
            <SectionTitle>Professional Summary</SectionTitle>
            <p className="text-[9.5pt] text-[#374151] leading-[1.6]">{summary}</p>
          </section>
        );
      case "experience":
        return experience.length > 0 && (
          <section key="experience">
            <SectionTitle>Work Experience</SectionTitle>
            <div className="space-y-[12pt]">
              {experience.map((exp: any, i: number) => (
                <div key={i} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[10pt] font-bold text-[#0f172a]">{exp.role}</h3>
                    <span className="text-[8pt] text-[#6b7280] font-medium shrink-0 ml-2">{exp.duration}</span>
                  </div>
                  <p className="text-[8.5pt] font-semibold mt-px mb-[4px]" style={{ color: themeColor }}>{exp.company}</p>
                  {exp.bullets?.length > 0 && (
                    <ul className="space-y-[3px]">
                      {exp.bullets.map((b: string, j: number) => (
                        <li key={j} className="flex gap-[6px] text-[9pt] text-[#4b5563] leading-[1.45]">
                          <span className="mt-px h-[4px] w-[4px] rounded-full shrink-0" style={{ backgroundColor: themeColor }} />
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
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-[10pt]">
              {projects.map((proj: any, i: number) => (
                <div key={i} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[9.5pt] font-bold text-[#0f172a]">{proj.title}</h3>
                    <ResumeLink href={proj.link} className="text-[7.5pt] ml-2 shrink-0" style={{ color: themeColor }} />
                  </div>
                  {proj.techStack && (
                    <p className="text-[8pt] font-semibold mt-px mb-[3px]" style={{ color: themeColor }}>
                      {Array.isArray(proj.techStack) ? proj.techStack.join(" · ") : proj.techStack}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-[8.5pt] text-[#6b7280] mb-[3px] leading-[1.4]">{proj.description}</p>
                  )}
                  {proj.bullets?.length > 0 && (
                    <ul className="space-y-[2px]">
                      {proj.bullets.map((b: string, j: number) => (
                        <li key={j} className="flex gap-[6px] text-[8.5pt] text-[#4b5563]">
                          <span className="mt-px h-[4px] w-[4px] rounded-full shrink-0" style={{ backgroundColor: themeColor }} />
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
      case "certifications":
        return certifications.length > 0 && (
          <section key="certifications">
            <SectionTitle>Certifications</SectionTitle>
            <div className="space-y-[6px]">
              {certifications.map((cert: any, i: number) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[9pt] font-semibold text-[#1e293b]">{cert.name}</span>
                    {cert.issuer && <span className="text-[8pt] text-[#6b7280]"> · {cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="text-[7.5pt] text-[#9ca3af] shrink-0 ml-2">{cert.date}</span>}
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
    <div 
      className="bg-white" 
      style={{ 
        fontFamily: "'Inter', 'Calibri', sans-serif",
        minHeight: "297mm"
      }}
    >
      <div 
        className="flex text-[#1a1a1a]"
        style={{
          zoom: scale,
          minHeight: "297mm"
        }}
      >
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-[36%] flex flex-col gap-5 pl-[54pt] pr-[18pt] py-[36pt]" style={{ backgroundColor: "#f0f4f8" }}>

        {/* NAME BLOCK */}
        <div className="mb-2">
          <h1 className="text-[19pt] font-extrabold leading-tight text-[#0f172a] mb-1">
            {(personalInfo.name || "YOUR NAME").split(" ").map((w: string, i: number) => (
              <span key={i} className={i === 0 ? "block" : "block"}>{w}</span>
            ))}
          </h1>
          {experience[0]?.role && (
            <p className="text-[9pt] font-semibold tracking-wide" style={{ color: themeColor }}>
              {experience[0].role}
            </p>
          )}
        </div>

        {/* CONTACT */}
        <div>
          <SectionTitle>Contact</SectionTitle>
          <div className="space-y-[5px] text-[8.5pt] text-[#374151]">
            {personalInfo.email && <p className="break-all">{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && (
              <ResumeLink href={personalInfo.linkedin} className="font-medium block" style={{ color: themeColor }}>
                {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
              </ResumeLink>
            )}
            {personalInfo.portfolio && (
              <ResumeLink href={personalInfo.portfolio} className="font-medium block" style={{ color: themeColor }}>
                {cleanUrl(personalInfo.portfolio) || "Portfolio"}
              </ResumeLink>
            )}
          </div>
        </div>

        {sidebarOrder.map((id: string) => renderSidebarSection(id))}
      </aside>

      {/* ── RIGHT MAIN CONTENT ── */}
      <main className="flex-1 pl-[18pt] pr-[54pt] py-[36pt] space-y-[16pt]">
        {mainOrder.map((id: string) => renderMainSection(id))}
      </main>
      </div>
    </div>
  );
}