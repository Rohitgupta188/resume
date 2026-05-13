"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";

/* ─────────────────────────────────────────────────────────────
   PROFESSIONAL — Classic single-column, recruiter-trusted layout
   Serif-inspired feel, burgundy accent #7c2d3e
   Clean section rules, bold job titles, scannable bullets
───────────────────────────────────────────────────────────── */

const DEFAULT_BURGUNDY = "#7c2d3e";

export function ProfessionalPreview({
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
  const themeColor = safeContent.themeColor || DEFAULT_BURGUNDY;

  const FONT_SCALES: Record<string, number> = {
    small: 0.9,
    normal: 1,
    large: 1.1,
  };
  const scale = FONT_SCALES[safeContent.fontSize || "normal"] || 1;

  const Rule = () => (
    <div
      className="border-b mb-[6px]"
      style={{ borderBottomColor: themeColor }}
    />
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div
      className="section-title-block"
      style={{ marginBottom: `${7 * scale}pt` }}
    >
      <h2
        className="font-extrabold uppercase tracking-[0.15em]"
        style={{ color: themeColor, fontSize: `${10 * scale}pt` }}
      >
        {children}
      </h2>
      <Rule />
    </div>
  );

  const sectionOrder = safeContent.sectionOrder || [
    "summary",
    "projects",
    "experience",
    "education",
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
              <SectionTitle>Work Experience</SectionTitle>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${10 * scale}pt`,
                }}
              >
                {experience.map((exp: any, i: number) => (
                  <div key={i} className="experience-item">
                    <div className="flex justify-between items-baseline">
                      <h3
                        className="font-bold text-[#0f172a]"
                        style={{
                          fontSize: `${10.5 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {exp.role}
                      </h3>
                      <span
                        className="text-[#6b7280] font-medium"
                        style={{
                          fontSize: `${8.5 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {exp.duration}
                      </span>
                    </div>
                    <p
                      className="font-semibold mb-[4px]"
                      style={{
                        color: themeColor,
                        fontSize: `${9 * scale}pt`,
                        textAlign: "justify",
                      }}
                    >
                      {exp.company}
                    </p>
                    {exp.bullets?.length > 0 && (
                      <ul
                        className="space-y-[3px] ml-[20px]"
                        style={{ listStyleType: "disc" }}
                      >
                        {exp.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="text-[#374151] leading-normal"
                            style={{
                              fontSize: `${9 * scale}pt`,
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${7 * scale}pt`,
                }}
              >
                {education.map((edu: any, i: number) => (
                  <div
                    key={i}
                    className="education-item flex justify-between items-start"
                  >
                    <div>
                      <h3
                        className="font-bold text-[#0f172a]"
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
                      {edu.gpa && (
                        <p
                          className="text-[#6b7280]"
                          style={{
                            fontSize: `${9.5 * scale}pt`,
                            textAlign: "justify",
                          }}
                        >
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-[#333a46] shrink-0 ml-4"
                      style={{
                        fontSize: `${9.5 * scale}pt`,
                        textAlign: "justify",
                      }}
                    >
                      {edu.year}
                    </span>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${10 * scale}pt`,
                }}
              >
                {projects.map((proj: any, i: number) => (
                  <div
                    key={i}
                    className="project-item pb-[10pt] border-b border-[#e5e7eb] last:border-b-0"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        className="font-bold text-[#0f172a] leading-tight"
                        style={{
                          fontSize: `${11.3 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {proj.title}
                      </h3>
                      <ResumeLink
                        href={proj.link}
                        className="shrink-0 mt-px font-bold"
                        style={{
                          color: themeColor,
                          fontSize: `${9 * scale}pt`,
                        }}
                      />
                    </div>
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
                    {proj.description && (
                      <p
                        className="text-[#4b5563] leading-normal mt-[6px] font-bold"
                        style={{
                          fontSize: `${10 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {proj.description}
                      </p>
                    )}
                    {proj.bullets?.length > 0 && (
                      <ul
                        className="space-y-[6px] mt-1 ml-[20px]"
                        style={{ listStyleType: "disc" }}
                      >
                        {proj.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="text-[#374151] leading-[1.45]"
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
      case "skills":
        return (
          skills.length > 0 && (
            <section key="skills">
              <SectionTitle>Skills</SectionTitle>
              <div className="space-y-[4px]">
                {skills.map((skill: string, i: number) => (
                  <div
                    key={i}
                    className="text-[#374151] leading-[1.4] font-black"
                    style={{
                      fontSize: `${10.5 * scale}pt`,
                      textAlign: "justify",
                    }}
                  >
                    {skill.includes(":") ? (
                      <>
                        <span className="font-bold text-[#0f172a]">
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
                      fontSize: `${10.5 * scale}pt`,
                      textAlign: "justify",
                    }}
                  >
                    <span className="font-black text-[#374151]">
                      {l.language}
                    </span>
                    <span className="text-[#6b7280] italic font-bold">
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
              <div className="space-y-[4px]">
                {certifications.map((cert: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <div>
                      <span
                        className="font-semibold text-[#1e293b]"
                        style={{
                          fontSize: `${9.5 * scale}pt`,
                          textAlign: "justify",
                        }}
                      >
                        {cert.name}
                      </span>
                      {cert.issuer && (
                        <span
                          className="text-[#3e4044] font-black"
                          style={{
                            fontSize: `${8.5 * scale}pt`,
                            textAlign: "justify",
                          }}
                        >
                          {" "}
                          · {cert.issuer}
                        </span>
                      )}
                    </div>
                    {cert.date && (
                      <span
                        className="text-[#3e4044] font-black"
                        style={{ fontSize: `${9.5 * scale}pt` }}
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
      case "customSections":
        return (
          customSections.length > 0 && (
            <CustomSectionsBlock
              key="customSections"
              sections={customSections}
              variant="vertical"
              scale={scale}
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
      className={`bg-[#f3f4f6] flex flex-col items-center ${isPrint ? "" : "py-2"}`}
      style={{
        padding: isPrint ? 0 : undefined,
        zoom: isPrint ? 1 : undefined,
      }}
    >
      <div
        className="resume-page bg-white text-[#1a1a1a]"
        style={{
          width: "210mm",
          minHeight: isPrint ? "auto" : "297mm",
          background: "white",
          padding: "22pt 30pt",
          boxSizing: "border-box",
          fontFamily: "'Calibri', 'Inter', sans-serif",
          marginBottom: isPrint ? "0" : "18px",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* ── HEADER ── */}
        <header className="text-center mb-[18pt]">
          <h1
            className="font-extrabold tracking-tight text-[#111827] mb-[4px]"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: `${22 * scale}pt`,
            }}
          >
            {personalInfo.name || "YOUR NAME"}
          </h1>
          {experience[0]?.role && (
            <p
              className="font-semibold mb-[6px]"
              style={{ color: themeColor, fontSize: `${10 * scale}pt` }}
            >
              {experience[0].role}
            </p>
          )}
          <div
            className="flex flex-wrap justify-center gap-x-[12px] gap-y-[2px] text-[#374151]"
            style={{
              fontFamily: "'Calibri', 'Inter', sans-serif",
              fontSize: `${9 * scale}pt`,
            }}
          >
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && (
              <ResumeLink
                href={personalInfo.linkedin}
                className="font-semibold"
                style={{ color: themeColor }}
              >
                {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
              </ResumeLink>
            )}
            {personalInfo.portfolio && (
              <ResumeLink
                href={personalInfo.portfolio}
                className="font-semibold"
                style={{ color: themeColor }}
              >
                {cleanUrl(personalInfo.portfolio) || "Portfolio"}
              </ResumeLink>
            )}
          </div>
          <div
            className="border-b-2 mt-[10px]"
            style={{ borderBottomColor: themeColor }}
          />
        </header>

        <div
          style={{
            fontFamily: "'Calibri', 'Inter', sans-serif",
            display: "flex",
            flexDirection: "column",
            gap: `${10 * scale}pt`,
          }}
        >
          {sectionOrder.map((id: string) => renderSection(id))}
        </div>
      </div>
    </div>
  );
}
