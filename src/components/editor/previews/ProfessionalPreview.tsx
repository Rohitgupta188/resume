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

export function ProfessionalPreview({ content }: { content: any }) {
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
    <div className="mb-[8px]">
      <h2
        className="text-[10pt] font-extrabold uppercase tracking-[0.15em]"
        style={{ color: themeColor }}
      >
        {children}
      </h2>
      <Rule />
    </div>
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
              <SectionTitle>Professional Summary</SectionTitle>
              <p className="text-[9.5pt] text-[#374151] leading-[1.65]">
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
              <div className="space-y-[10pt]">
                {experience.map((exp: any, i: number) => (
                  <div
                    key={i}
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[10.5pt] font-bold text-[#0f172a]">
                        {exp.role}
                      </h3>
                      <span className="text-[8.5pt] text-[#6b7280] font-medium">
                        {exp.duration}
                      </span>
                    </div>
                    <p
                      className="text-[9pt] font-semibold mb-[4px]"
                      style={{ color: themeColor }}
                    >
                      {exp.company}
                    </p>
                    {exp.bullets?.length > 0 && (
                      <ul
                        className="space-y-[3px] ml-[14px]"
                        style={{ listStyleType: "disc" }}
                      >
                        {exp.bullets.map((b: string, j: number) => (
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
              <div className="space-y-[8px]">
                {education.map((edu: any, i: number) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[10pt] font-bold text-[#0f172a]">
                        {edu.school}
                      </h3>
                      <p className="text-[9pt] text-[#4b5563]">
                        {edu.degree}
                        {edu.field ? `, ${edu.field}` : ""}
                      </p>
                      {edu.gpa && (
                        <p className="text-[8.5pt] text-[#6b7280]">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    <span className="text-[9pt] text-[#6b7280] shrink-0 ml-4">
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
              <div className="space-y-[8pt]">
                {projects.map((proj: any, i: number) => (
                  <div
                    key={i}
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[10pt] font-bold text-[#0f172a]">
                        {proj.title}
                      </h3>
                      <ResumeLink
                        href={proj.link}
                        className="text-[8pt] ml-2 shrink-0"
                        style={{ color: themeColor }}
                      />
                    </div>
                    {proj.techStack && (
                      <p
                        className="text-[8.5pt] font-semibold mb-[3px]"
                        style={{ color: themeColor }}
                      >
                        {Array.isArray(proj.techStack)
                          ? proj.techStack.join(" · ")
                          : proj.techStack}
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-[9pt] text-[#6b7280] mb-[3px]">
                        {proj.description}
                      </p>
                    )}
                    {proj.bullets?.length > 0 && (
                      <ul
                        className="space-y-[2px] ml-[14px]"
                        style={{ listStyleType: "disc" }}
                      >
                        {proj.bullets.map((b: string, j: number) => (
                          <li key={j} className="text-[8.5pt] text-[#374151]">
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
                    className="text-[9pt] text-[#374151] leading-[1.4]"
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
                  <div key={i} className="flex justify-between text-[9pt]">
                    <span className="font-medium text-[#374151]">
                      {l.language}
                    </span>
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
              <div className="space-y-[4px]">
                {certifications.map((cert: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <div>
                      <span className="text-[9.5pt] font-semibold text-[#1e293b]">
                        {cert.name}
                      </span>
                      {cert.issuer && (
                        <span className="text-[8.5pt] text-[#6b7280]">
                          {" "}
                          · {cert.issuer}
                        </span>
                      )}
                    </div>
                    {cert.date && (
                      <span className="text-[8.5pt] text-[#9ca3af]">
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
      style={{ fontFamily: "'Georgia', 'Cambria', serif" }}
    >
      <div
        style={{
          zoom: scale,
        }}
        className="px-[54pt] py-[36pt] font-sans text-[#1a1a1a]"
      >
        {/* ── HEADER ── */}
        <header className="text-center mb-[18pt]">
          <h1
            className="text-[22pt] font-extrabold tracking-tight text-[#111827] mb-[4px]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {personalInfo.name || "YOUR NAME"}
          </h1>
          {experience[0]?.role && (
            <p
              className="text-[10pt] font-semibold mb-[6px]"
              style={{ color: themeColor }}
            >
              {experience[0].role}
            </p>
          )}
          <div
            className="flex flex-wrap justify-center gap-x-[12px] gap-y-[2px] text-[9pt] text-[#374151]"
            style={{ fontFamily: "'Calibri', 'Inter', sans-serif" }}
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
          style={{ fontFamily: "'Calibri', 'Inter', sans-serif" }}
          className="space-y-[12pt]"
        >
          {sectionOrder.map((id: string) => renderSection(id))}
        </div>
      </div>
    </div>
  );
}
