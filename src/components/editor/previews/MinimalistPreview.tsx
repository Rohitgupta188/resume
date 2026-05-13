"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";

/* ─────────────────────────────────────────────────────────────
   MINIMALIST — High whitespace, ultra-clean, monochrome
   Focus purely on typography and content spacing.
   Black and white only, 10pt/11pt sans-serif.
───────────────────────────────────────────────────────────── */

export function MinimalistPreview({
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

  const FONT_SCALES: Record<string, number> = {
    small: 0.9,
    normal: 1,
    large: 1.1,
  };
  const scale = FONT_SCALES[safeContent.fontSize || "normal"] || 1;

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="font-black uppercase tracking-[0.25em] text-[#111827] mb-[12px] pb-[2px] border-b border-[#e5e7eb]"
      style={{ fontSize: `${10 * scale}pt` }}
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

  const renderSection = (id: string) => {
    switch (id) {
      case "summary":
        return (
          summary && (
            <section key="summary">
              <SectionTitle>Summary</SectionTitle>
              <p
                className="text-[#374151] leading-[1.65] font-bold"
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
              <SectionTitle>Experience</SectionTitle>
              <div className="space-y-[16pt]">
                {experience.map((exp: any, i: number) => (
                  <div key={i} className="experience-item">
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3
                        className="font-bold text-[#111827]"
                        style={{
                          fontSize: `${11 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {exp.company}
                      </h3>
                      <span
                        className="text-[#6b7280] font-mono tracking-tight"
                        style={{
                          fontSize: `${8.5 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {exp.duration}
                      </span>
                    </div>
                    <p
                      className="italic text-[#4b5563] mb-[6px]"
                      style={{
                        fontSize: `${10 * scale}pt`,
                        textAlign: "justify",
                      }}
                    >
                      {exp.role}
                    </p>
                    {exp.bullets?.length > 0 && (
                      <ul
                        className="space-y-[4px] ml-[20px]"
                        style={{ listStyleType: "disc" }}
                      >
                        {exp.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="text-[#374151] leading-normal pl-[4px]"
                            style={{
                              fontSize: `${9.5 * scale}pt`,
                              textAlign: "justify",
                            }}
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
                    className="project-item pb-[10pt] border-b border-[#e5e7eb] last:border-b-0"
                  >
                    <div className="flex justify-between items-baseline mb-[8px]">
                      <h3
                        className="font-bold text-[#111827]"
                        style={{
                          fontSize: `${11.3 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {proj.title}
                      </h3>
                      <ResumeLink
                        href={proj.link}
                        className="ml-2 shrink-0 text-[#6b7280]"
                        style={{
                          fontSize: `${8.5 * scale}pt`,
                          textAlign: "justify",
                        }}
                      />
                    </div>
                    {proj.description && (
                      <p
                        className="text-[#4b5563] mt-1 font-bold"
                        style={{
                          fontSize: `${10 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {proj.description}
                      </p>
                    )}
                    {proj.techStack && (
                      <p
                        className="font-semibold mt-[2px]"
                        style={{
                          color: "text-[#4b5563]",
                          fontSize: `${8 * scale}pt`,
                        }}
                      >
                        {proj.techStack}
                      </p>
                    )}
                    {proj.bullets?.length > 0 && (
                      <ul
                        className="mt-[8px] space-y-[10px] ml-[20px]"
                        style={{ listStyleType: "disc" }}
                      >
                        {proj.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="text-[#374151] leading-normal "
                            style={{
                              fontSize: `${9.5 * scale}pt`,
                              textAlign: "justify",
                            }}
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
                    <h3
                      className="font-bold text-[#111827] mb-[2px] education-item"
                      style={{
                        fontSize: `${11 * scale}pt`,
                        textAlign: "justify",
                      }}
                    >
                      {edu.school}
                    </h3>
                    <p
                      className="text-[#4b5563]"
                      style={{
                        fontSize: `${10 * scale}pt`,
                        textAlign: "justify",
                      }}
                    >
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </p>
                    <p
                      className="text-[#6b7280] mt-[2px]"
                      style={{
                        fontSize: `${8.5 * scale}pt`,
                        textAlign: "justify",
                      }}
                    >
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
                    className="text-[#374151] leading-tight"
                    style={{
                      fontSize: `${9.5 * scale}pt`,
                      textAlign: "justify",
                    }}
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
                  <div
                    key={i}
                    className="flex justify-between"
                    style={{
                      fontSize: `${9.5 * scale}pt`,
                      textAlign: "justify",
                    }}
                  >
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
                    <p
                      className="font-bold text-[#111827]"
                      style={{
                        fontSize: `${9.5 * scale}pt`,
                        textAlign: "justify",
                      }}
                    >
                      {cert.name}
                    </p>
                    <p
                      className="text-[#6b7280] mt-[2px]"
                      style={{
                        fontSize: `${8.5 * scale}pt`,
                        textAlign: "justify",
                      }}
                    >
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
      className={`bg-[#f3f4f6] flex flex-col items-center ${
        isPrint ? "" : "py-6"
      }`}
      style={{ zoom: isPrint ? 1 : undefined }}
    >
      <div
        className="resume-page bg-white text-[#1f2937]"
        style={{
          width: "210mm",
          minHeight: isPrint ? "unset" : "297mm",
          padding: "16pt 34pt",
          background: "white",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        {/* ── HEADER ── */}
        <header className="mb-[24pt]">
          <h1
            className="font-black tracking-tight text-[#000000] mb-[8px] leading-none uppercase"
            style={{ fontSize: `${26 * scale}pt` }}
          >
            {personalInfo.name || "YOUR NAME"}
          </h1>
          <div
            className="flex flex-wrap gap-x-[16px] gap-y-[4px] text-[#4b5563]"
            style={{ fontSize: `${8.5 * scale}pt` }}
          >
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.linkedin && (
              <ResumeLink
                href={personalInfo.linkedin}
                className="font-bold text-[#111827]"
                style={{ fontSize: `${8.5 * scale}pt` }}
              >
                {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
              </ResumeLink>
            )}
            {personalInfo.portfolio && (
              <ResumeLink
                href={personalInfo.portfolio}
                className="font-bold text-[#111827]"
                style={{ fontSize: `${8.5 * scale}pt` }}
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
