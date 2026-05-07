"use client";
import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { ResumeLink, cleanUrl } from "./resume-utils";

/* ─────────────────────────────────────────────────────────────
   CREATIVE — Dark left sidebar, teal accents, bold headers
───────────────────────────────────────────────────────────── */

const DEFAULT_ACCENT = "#0d9488"; // Teal-600
const DARK = "#1e293b";   // Slate-800

export function CreativePreview({ content }: { content: any }) {
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
    "summary", "experience", "education", "projects", "skills", "certifications", "languages", "customSections"
  ];

  const SIDEBAR_IDS = ["skills", "languages", "certifications", "customSections"];
  const MAIN_IDS = ["summary", "experience", "projects", "education"];

  const sidebarOrder = sectionOrder.filter((id: string) => SIDEBAR_IDS.includes(id));
  const mainOrder = sectionOrder.filter((id: string) => MAIN_IDS.includes(id));

  const renderSidebarSection = (id: string) => {
    switch (id) {
      case "skills":
        return skills.length > 0 && (
          <div key="skills">
            <h2 className="text-[8pt] font-black uppercase tracking-[0.25em] mb-[10px] pb-[4px] border-b" style={{ color: themeColor, borderColor: themeColor }}>Skills</h2>
            <div className="space-y-[6px]">
              {skills.map((skill: string, i: number) => (
                <div key={i} className="px-[8px] py-[4px] rounded text-[8pt] font-medium leading-tight" style={{ backgroundColor: "rgba(13, 148, 136, 0.2)", color: "#ccfbf1" }}>
                  {skill.includes(":") ? (
                    <>
                      <span className="font-bold text-white">{skill.split(":")[0]}:</span>
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
      case "languages":
        return languages.length > 0 && (
          <div key="languages">
            <h2 className="text-[8pt] font-black uppercase tracking-[0.25em] mb-[10px] pb-[4px] border-b" style={{ color: themeColor, borderColor: themeColor }}>Languages</h2>
            <div className="space-y-[4px] text-[8.5pt] text-slate-300">
              {languages.map((lang: any, i: number) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-bold text-white">{lang.language}</span>
                  <span className="italic">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "certifications":
        return certifications.length > 0 && (
          <div key="certifications">
            <h2 className="text-[8pt] font-black uppercase tracking-[0.25em] mb-[10px] pb-[4px] border-b" style={{ color: themeColor, borderColor: themeColor }}>Awards</h2>
            <div className="space-y-[8px]">
              {certifications.map((cert: any, i: number) => (
                <div key={i}>
                  <p className="font-bold text-[8.5pt] text-teal-100 leading-tight">{cert.name}</p>
                  <p className="text-[8pt] text-slate-400 mt-[2px] uppercase tracking-wider">{cert.issuer}</p>
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
            renderTitle={(title) => (
              <h2 className="text-[8pt] font-black uppercase tracking-[0.25em] mb-[10px] pb-[4px] border-b" style={{ color: themeColor, borderColor: themeColor }}>{title}</h2>
            )}
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
          <section key="summary" className="mb-[8pt]">
            <p className="text-[10pt] leading-normal text-slate-600 font-medium border-l-4 pl-[12px] py-[2px]" style={{ borderColor: themeColor }}>
              {summary}
            </p>
          </section>
        );
      case "experience":
        return experience.length > 0 && (
          <section key="experience">
            <h2 className="text-[10pt] font-black uppercase tracking-[0.25em] mb-[14px] text-[#1e293b] flex items-center gap-[12px]">
              <span className="text-white px-[8px] py-[3px] rounded-sm" style={{ backgroundColor: themeColor }}>Experience</span>
              <div className="h-[2px] flex-1 bg-slate-100" />
            </h2>
            <div className="space-y-[14pt] pl-[4px]">
              {experience.map((exp: any, i: number) => (
                <div key={i} className="relative border-l-2 border-slate-200 pl-[16px] pb-[4px]" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="absolute -left-[6px] top-[4px] h-[10px] w-[10px] rounded-full bg-white border-[3px]" style={{ borderColor: themeColor }} />
                  <div className="flex justify-between items-baseline mb-[2px]">
                    <h3 className="font-extrabold text-[11pt] text-slate-800">{exp.role}</h3>
                    <span className="text-[8.5pt] font-bold text-teal-700 bg-teal-50 px-[6px] py-[2px] rounded-full uppercase tracking-tighter">{exp.duration}</span>
                  </div>
                  <p className="text-[9.5pt] font-bold text-slate-500 mb-[6px] uppercase tracking-wide">{exp.company}</p>
                  {exp.bullets?.length > 0 && (
                    <ul className="space-y-[4px]">
                      {exp.bullets.map((b: string, j: number) => (
                        <li key={j} className="flex gap-[8px] text-[9.5pt] text-slate-600 leading-normal">
                          <span className="font-bold" style={{ color: themeColor }}>›</span>
                          <span>{b}</span>
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
            <h2 className="text-[10pt] font-black uppercase tracking-[0.25em] mb-[14px] text-[#1e293b] flex items-center gap-[12px]">
              <span className="text-white px-[8px] py-[3px] rounded-sm" style={{ backgroundColor: themeColor }}>Projects</span>
              <div className="h-[2px] flex-1 bg-slate-100" />
            </h2>
            <div className="space-y-[12pt] pl-[4px]">
              {projects.map((proj: any, i: number) => (
                <div key={i} className="bg-slate-50 p-[12px] rounded-lg border border-slate-100" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline mb-[4px]">
                    <h3 className="font-black text-[10.5pt] text-slate-800">{proj.title}</h3>
                    <ResumeLink href={proj.link} className="text-[8pt] font-bold uppercase tracking-widest" style={{ color: themeColor }}>
                      {proj.link ? "↗ Link" : ""}
                    </ResumeLink>
                  </div>
                  {proj.description && <p className="text-[9pt] text-slate-600 leading-relaxed mb-[6px]">{proj.description}</p>}
                  {proj.techStack && (
                    <div className="flex flex-wrap gap-[6px]">
                       {Array.isArray(proj.techStack) ? proj.techStack.map((tech: string, j: number) => (
                          <span key={j} className="text-[7.5pt] font-bold text-slate-400 uppercase tracking-widest">{tech}</span>
                       )) : <span className="text-[7.5pt] font-bold text-slate-400 uppercase tracking-widest">{proj.techStack}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "education":
        return education.length > 0 && (
          <section key="education">
            <h2 className="text-[10pt] font-black uppercase tracking-[0.25em] mb-[14px] text-[#1e293b] flex items-center gap-[12px]">
              <span className="text-white px-[8px] py-[3px] rounded-sm" style={{ backgroundColor: themeColor }}>Education</span>
              <div className="h-[2px] flex-1 bg-slate-100" />
            </h2>
            <div className="space-y-[10pt] pl-[4px]">
              {education.map((edu: any, i: number) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-extrabold text-[10.5pt] text-slate-800 leading-tight">{edu.school}</p>
                    <p className="text-[9.5pt] text-slate-500 font-medium mt-[2px]">{edu.degree}</p>
                  </div>
                  <span className="text-[9pt] font-black text-slate-400">{edu.year}</span>
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
      className="min-h-full bg-white" 
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        style={{
          zoom: scale,
        }}
        className="min-h-full flex text-[#1a1a1a]"
      >
      
      {/* ── LEFT SIDEBAR (DARK) ── */}
      <aside className="w-[33%] text-white pl-[54pt] pr-[18pt] py-[36pt] flex flex-col gap-[20pt]" style={{ backgroundColor: DARK }}>
        
        {/* CONTACT */}
        <div>
          <h2 className="text-[8pt] font-black uppercase tracking-[0.25em] mb-[10px] pb-[4px] border-b" style={{ color: themeColor, borderColor: themeColor }}>Contact</h2>
          <div className="space-y-[6px] text-[8.5pt] text-slate-300 break-all">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && (
              <ResumeLink href={personalInfo.linkedin} className="font-bold text-white">
                {cleanUrl(personalInfo.linkedin) || "LinkedIn"}
              </ResumeLink>
            )}
            {personalInfo.portfolio && (
              <ResumeLink href={personalInfo.portfolio} className="font-bold text-white">
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
          <h1 className="text-[32pt] font-black text-[#1e293b] tracking-tighter uppercase leading-[1.1] mb-[10px]">
            {personalInfo.name || "CREATIVE MIND"}
          </h1>
        </header>

        {mainOrder.map((id: string) => renderMainSection(id))}
      </main>
      </div>
    </div>
  );
}
