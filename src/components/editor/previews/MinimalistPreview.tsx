"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";

/* ─────────────────────────────────────────────────────────────
   MINIMALIST — High whitespace, ultra-clean, monochrome
   Focus purely on typography and content spacing.
   Black and white only, 10pt/11pt sans-serif.
───────────────────────────────────────────────────────────── */

export function MinimalistPreview({ content }: { content: any }) {
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

  const FONT_SCALES: Record<string, number> = {
    small: 0.9,
    normal: 1,
    large: 1.1,
  };
  const scale = FONT_SCALES[safeContent.fontSize || "normal"] || 1;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-[9.5pt] font-black uppercase tracking-[0.25em] text-[#111827] mb-[12px] pb-[4px] border-b border-[#e5e7eb]">
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

  const renderSection = (id: string) => {
    switch (id) {
      case "summary":
        return (
          summary && (
            <section key="summary">
              <p className="text-[10pt] text-[#374151] leading-[1.7] max-w-[90%]">
                {summary}
              </p>
            </section>
          )
        );
      case "experience":
        return (
          experience.length > 0 && (
            <section key="experience">
              <SectionTitle>Experience</SectionTitle>
              <div className="space-y-[16pt]">
                {experience.map((exp: any, i: number) => (
                  <div
                    key={i}
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3 className="text-[10.5pt] font-bold text-[#111827]">
                        {exp.company}
                      </h3>
                      <span className="text-[8.5pt] text-[#6b7280] font-mono tracking-tight">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-[9.5pt] italic text-[#4b5563] mb-[6px]">
                      {exp.role}
                    </p>
                    {exp.bullets?.length > 0 && (
                      <ul
                        className="space-y-[4px] ml-[14px]"
                        style={{ listStyleType: "circle" }}
                      >
                        {exp.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="text-[9.5pt] text-[#374151] leading-normal pl-[4px]"
                          >
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
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3 className="text-[10pt] font-bold text-[#111827]">
                        {proj.title}
                      </h3>
                      <ResumeLink
                        href={proj.link}
                        className="text-[8.5pt] ml-2 shrink-0 text-[#6b7280]"
                      />
                    </div>
                    {proj.description && (
                      <p className="text-[9.5pt] text-[#4b5563] mb-[4px] leading-normal">
                        {proj.description}
                      </p>
                    )}
                    {proj.techStack && (
                      <p className="text-[8.5pt] font-medium text-[#6b7280]">
                        {Array.isArray(proj.techStack)
                          ? proj.techStack.join(" • ")
                          : proj.techStack}
                      </p>
                    )}
                    {proj.bullets?.length > 0 && (
                      <ul
                        className="mt-[4px] space-y-[2px] ml-[14px]"
                        style={{ listStyleType: "circle" }}
                      >
                        {proj.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="text-[9pt] text-[#374151] leading-normal"
                          >
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
      case "education":
        return (
          education.length > 0 && (
            <section key="education">
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-[10pt]">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <h3 className="text-[10pt] font-bold text-[#111827] mb-[2px]">
                      {edu.school}
                    </h3>
                    <p className="text-[9.5pt] text-[#4b5563]">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </p>
                    <p className="text-[8.5pt] text-[#6b7280] mt-[2px]">
                      {edu.year}
                      {edu.gpa ? ` • GPA: ${edu.gpa}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )
        );
      case "skills":
        return (
          skills.length > 0 && (
            <section key="skills">
              <SectionTitle>Skills</SectionTitle>
              <div className="space-y-[4px]">
                {skills.map((skill: string, i: number) => (
                  <div
                    key={i}
                    className="text-[9.5pt] text-[#374151] leading-tight"
                  >
                    {skill.includes(":") ? (
                      <>
                        <span className="font-bold text-[#111827]">
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
      case "languages":
        return (
          languages.length > 0 && (
            <section key="languages">
              <SectionTitle>Languages</SectionTitle>
              <div className="space-y-[4px]">
                {languages.map((l: any, i: number) => (
                  <div key={i} className="flex justify-between text-[9.5pt]">
                    <span className="text-[#111827]">{l.language}</span>
                    <span className="text-[#6b7280] italic">
                      {l.proficiency}
                    </span>
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
              <div className="grid grid-cols-2 gap-[12pt]">
                {certifications.map((cert: any, i: number) => (
                  <div key={i}>
                    <p className="text-[9.5pt] font-bold text-[#111827]">
                      {cert.name}
                    </p>
                    <p className="text-[8.5pt] text-[#6b7280] mt-[2px]">
                      {cert.issuer}
                      {cert.date ? ` • ${cert.date}` : ""}
                    </p>
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
              variant="inline"
              renderTitle={(title) => <SectionTitle>{title}</SectionTitle>}
            />
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
        className="px-[54pt] py-[36pt] text-[#1f2937]"
      >
        {/* ── HEADER ── */}
        <header className="mb-[24pt]">
          <h1 className="text-[26pt] font-black tracking-tight text-[#000000] mb-[8px] leading-none uppercase">
            {personalInfo.name || "YOUR NAME"}
          </h1>
          <div className="flex flex-wrap gap-x-[16px] gap-y-[4px] text-[8.5pt] text-[#4b5563]">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.linkedin && (
              <ResumeLink
                href={personalInfo.linkedin}
                className="font-bold text-[#111827]"
              >
                {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
              </ResumeLink>
            )}
            {personalInfo.portfolio && (
              <ResumeLink
                href={personalInfo.portfolio}
                className="font-bold text-[#111827]"
              >
                {cleanUrl(personalInfo.portfolio) || "Portfolio"}
              </ResumeLink>
            )}
          </div>
        </header>

        <div className="space-y-[18pt]">
          {sectionOrder.map((id: string) => renderSection(id))}
        </div>
      </div>
    </div>
  );
}
