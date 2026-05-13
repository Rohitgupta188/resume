"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";

/* ─────────────────────────────────────────────────────────────
   CREATIVE — Dark left sidebar, teal accents, bold headers
───────────────────────────────────────────────────────────── */

const DEFAULT_ACCENT = "#0d9488"; // Teal-600
const DARK = "#1e293b"; // Slate-800

export function CreativePreview({
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
  const themeColor = safeContent.themeColor || DEFAULT_ACCENT;

  const FONT_SCALES: Record<string, number> = {
    small: 0.9,
    normal: 1,
    large: 1.1,
  };
  const scale = FONT_SCALES[safeContent.fontSize || "normal"] || 1;

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
    "languages",
    "certifications",
    "customSections",
  ];
  const MAIN_IDS = ["summary", "experience", "projects", "education"];

  const sidebarOrder = sectionOrder.filter((id: string) =>
    SIDEBAR_IDS.includes(id),
  );
  const mainOrder = sectionOrder.filter((id: string) => MAIN_IDS.includes(id));

  const renderSidebarSection = (id: string) => {
    switch (id) {
      case "skills":
        return (
          skills.length > 0 && (
            <div key="skills">
              <h2
                className="font-black uppercase tracking-[0.25em] mb-[10px] pb-[4px] border-b"
                style={{
                  color: "white",
                  borderColor: "white",
                  fontSize: `${8 * scale}pt`,
                }}
              >
                Skills
              </h2>
              <div className="space-y-[10px]">
                {skills.map((skill: string, i: number) => (
                  <div
                    key={i}
                    className="px-[8px] py-[4px] rounded font-medium leading-tight"
                    style={{
                      backgroundColor: "rgba(13, 148, 136, 0.2)",
                      color: "#ccfbf1",
                      fontSize: `${8.5 * scale}pt`,
                    }}
                  >
                    {skill.includes(":") ? (
                      <>
                        <span className="font-bold text-white">
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
            </div>
          )
        );
      case "languages":
        return (
          languages.length > 0 && (
            <div key="languages">
              <h2
                className="font-black uppercase tracking-[0.25em] mb-[10px] pb-[4px] border-b"
                style={{
                  color: "white",
                  borderColor: "white",
                  fontSize: `${8 * scale}pt`,
                }}
              >
                Languages
              </h2>
              <div
                className="space-y-[4px] text-slate-300"
                style={{ fontSize: `${8.5 * scale}pt` }}
              >
                {languages.map((lang: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="font-bold text-white">
                      {lang.language}
                    </span>
                    <span className="italic">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        );
      case "certifications":
        return (
          certifications.length > 0 && (
            <div key="certifications">
              <h2
                className="font-black uppercase tracking-[0.25em] mb-[10px] pb-[4px] border-b"
                style={{
                  color: "white",
                  borderColor: "white",
                  fontSize: `${8 * scale}pt`,
                }}
              >
                Awards
              </h2>
              <div className="space-y-[8px]">
                {certifications.map((cert: any, i: number) => (
                  <div key={i}>
                    <p
                      className="font-bold text-teal-100 leading-tight"
                      style={{ fontSize: `${8.5 * scale}pt` }}
                    >
                      {cert.name}
                    </p>
                    <p
                      className="text-slate-400 mt-[2px] uppercase tracking-wider"
                      style={{ fontSize: `${8 * scale}pt` }}
                    >
                      {cert.issuer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        );
      case "customSections":
        return (
          customSections.length > 0 && (
            <CustomSectionsBlock
              key="customSections"
              sections={customSections}
              itemCls="text-white"
              variant="vertical"
              renderTitle={(title) => (
                <h2
                  className="font-bold uppercase tracking-[0.25em] mb-[10px] pb-[4px] border-b"
                  style={{
                    color: "white",
                    borderColor: "white",
                    fontSize: `${8 * scale}pt`,
                  }}
                >
                  {title}
                </h2>
              )}
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
            <section key="summary" className="mb-[8pt]">
              <p
                className="leading-normal text-slate-600 font-bold border-l-4 pl-[12px] py-[2px]"
                style={{
                  borderColor: themeColor,
                  fontSize: `${10.3 * scale}pt`,
                  textAlign: "justify",
                }}
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
              <h2
                className="font-black uppercase tracking-[0.25em] mb-[14px] text-[#1e293b] flex items-center gap-[12px]"
                style={{ fontSize: `${10 * scale}pt` }}
              >
                <span
                  className="text-white px-[8px] py-[3px] rounded-sm"
                  style={{ backgroundColor: themeColor }}
                >
                  Experience
                </span>
                <div className="h-[2px] flex-1 bg-slate-100" />
              </h2>
              <div className="space-y-[14pt] pl-[4px]">
                {experience.map((exp: any, i: number) => (
                  <div
                    key={i}
                    className="relative border-l-2 border-slate-200 pl-[16px] pb-[4px] experience-item"
                  >
                    <div
                      className="absolute -left-[6px] top-[4px] h-[10px] w-[10px] rounded-full bg-white border-[3px]"
                      style={{ borderColor: themeColor }}
                    />
                    <div className="flex justify-between items-baseline mb-[2px]">
                      <h3
                        className="font-extrabold text-slate-800"
                        style={{ fontSize: `${11 * scale}pt` }}
                      >
                        {exp.role}
                      </h3>
                      <span
                        className="font-bold text-teal-700 bg-teal-50 px-[6px] py-[2px] rounded-full uppercase tracking-tighter"
                        style={{ fontSize: `${8.5 * scale}pt` }}
                      >
                        {exp.duration}
                      </span>
                    </div>
                    <p
                      className="font-bold text-slate-500 mb-[6px] uppercase tracking-wide"
                      style={{ fontSize: `${9.5 * scale}pt` }}
                    >
                      {exp.company}
                    </p>
                    {exp.bullets?.length > 0 && (
                      <ul className="space-y-[4px]">
                        {exp.bullets.map((b: string, j: number) => (
                          <li
                            key={j}
                            className="flex gap-[8px] text-slate-600 leading-normal"
                            style={{ fontSize: `${9.5 * scale}pt` }}
                          >
                            <span
                              className="font-bold"
                              style={{ color: themeColor }}
                            >
                              ›
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
              <h2
                className="font-black uppercase tracking-[0.25em] mb-[14px] text-[#1e293b] flex items-center gap-[12px]"
                style={{ fontSize: `${10 * scale}pt` }}
              >
                <span
                  className="text-white px-[8px] py-[3px] rounded-sm"
                  style={{ backgroundColor: themeColor }}
                >
                  Projects
                </span>
                <div className="h-[2px] flex-1 bg-slate-100" />
              </h2>
              <div className="space-y-[12pt] pl-[4px]">
                {projects.map((proj: any, i: number) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-[12px] rounded-lg border border-slate-100 project-item"
                  >
                    <div className="flex justify-between items-baseline mb-[4px]">
                      <h3
                        className="font-black text-slate-800"
                        style={{ fontSize: `${10.5 * scale}pt` }}
                      >
                        {proj.title}
                      </h3>
                      <ResumeLink
                        href={proj.link}
                        className="font-bold uppercase tracking-widest"
                        style={{
                          color: themeColor,
                          fontSize: `${8 * scale}pt`,
                        }}
                      >
                        {proj.link ? "↗ Link" : ""}
                      </ResumeLink>
                    </div>
                    {proj.description && (
                      <p
                        className="text-slate-600 leading-relaxed mb-[6px]"
                        style={{ fontSize: `${9 * scale}pt` }}
                      >
                        {proj.description}
                      </p>
                    )}
                    {proj.techStack && (
                      <p
                        className="font-semibold mt-[2px]"
                        style={{
                          color: "text-slate-600",
                          fontSize: `${8 * scale}pt`,
                        }}
                      >
                        {proj.techStack}
                      </p>
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
              <h2
                className="font-black uppercase tracking-[0.25em] mb-[14px] text-[#1e293b] flex items-center gap-[12px]"
                style={{ fontSize: `${10 * scale}pt`, marginTop: 15 }}
              >
                <span
                  className="text-white px-[8px] py-[3px] rounded-sm"
                  style={{ backgroundColor: themeColor }}
                >
                  Education
                </span>
                <div className="h-[2px] flex-1 bg-slate-100" />
              </h2>
              <div className="space-y-[10pt] pl-[4px]">
                {education.map((edu: any, i: number) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p
                        className="font-extrabold text-slate-800 leading-tight"
                        style={{ fontSize: `${10.5 * scale}pt` }}
                      >
                        {edu.school}
                      </p>
                      <p
                        className="text-slate-500 font-medium mt-[2px]"
                        style={{ fontSize: `${9.5 * scale}pt` }}
                      >
                        {edu.degree}
                      </p>
                    </div>
                    <span
                      className="font-black text-slate-400"
                      style={{ fontSize: `${9 * scale}pt` }}
                    >
                      {edu.year}
                    </span>
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
        className="resume-page min-h-full flex text-[#1a1a1a]"
        style={{
          width: "210mm",
          minHeight: "290mm",
          background: "white",
          padding: "1pt 5pt",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        {/* ── LEFT SIDEBAR (DARK) ── */}
        <aside
          className="w-[33%] text-white px-[28pt] py-[24pt] flex flex-col gap-[20pt]"
          style={{ backgroundColor: themeColor }}
        >
          {/* CONTACT */}
          <div>
            <h2
              className="font-bold uppercase tracking-[0.25em] mb-[6px] pb-[4px] border-b"
              style={{
                color: "white",
                borderColor: "white",
                fontSize: `${8 * scale}pt`,
              }}
            >
              Contact
            </h2>

            <div
              className="space-y-[6px] text-slate-200 "
              style={{
                fontSize: `${8.5 * scale}pt`,
                lineHeight: 1.5,
              }}
            >
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}

              {personalInfo.linkedin && (
                <ResumeLink
                  href={personalInfo.linkedin}
                  className="font-bold text-white "
                >
                  {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
                </ResumeLink>
              )}

              {personalInfo.portfolio && (
                <ResumeLink
                  href={personalInfo.portfolio}
                  className="font-bold text-white"
                >
                  {cleanUrl(personalInfo.portfolio) || "Portfolio"}
                </ResumeLink>
              )}
            </div>
          </div>

          {sidebarOrder.map((id: string) => renderSidebarSection(id))}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 pl-[18pt] pr-[54pt] py-[36pt] flex flex-col space-y-[18pt]">
          {/* HEADER */}
          <header className="mb-[8pt]">
            <h1
              className="font-black text-[#1e293b] tracking-tighter uppercase leading-[1.1] mb-[10px]"
              style={{ fontSize: `${24 * scale}pt` }}
            >
              {personalInfo.name || "CREATIVE MIND"}
            </h1>
          </header>

          {mainOrder.map((id: string) => renderMainSection(id))}
        </main>
      </div>
    </div>
  );
}
