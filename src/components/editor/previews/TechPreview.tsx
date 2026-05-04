"use client";

import React from "react";

export function TechPreview({ content }: { content: any }) {
  const {
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
  } = content;

  const TECH_BLUE = "#0891b2";

  return (
    <div className="p-[40pt] h-full flex flex-col font-sans bg-white text-[#1f2937]">
      {/* HEADER */}
      <header className={`flex justify-between items-center border-b-2 pb-6 mb-8`} style={{ borderBottomColor: TECH_BLUE }}>
        <div>
          <h1 className="text-3xl font-bold text-black uppercase tracking-tight">
            {personalInfo.name || "DEVELOPER NAME"}
          </h1>
          {personalInfo.portfolio && (
            <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-sm mt-1 block font-medium" style={{ color: TECH_BLUE }}>
              {personalInfo.portfolio.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
        <div className="text-right flex flex-col gap-0.5 text-[10pt] text-gray-600">
          <span>{personalInfo.email}</span>
          <span>{personalInfo.phone}</span>
          {personalInfo.linkedin && (
             <span className="font-semibold" style={{ color: TECH_BLUE }}>linkedin.com/in/profile</span>
          )}
          <span>{personalInfo.location}</span>
        </div>
      </header>

      <div className="flex gap-10 flex-1 overflow-hidden">
        {/* MAIN COLUMN */}
        <div className="flex-[2.5] space-y-8">
          {summary && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: TECH_BLUE }}>Profile</h2>
              <p className="text-[10.5pt] leading-relaxed text-gray-700">{summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: TECH_BLUE }}>Experience</h2>
              <div className="space-y-6">
                {experience.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-[12pt] text-gray-900">{exp.role}</h3>
                      <span className="text-[9pt] text-gray-500 font-mono tracking-tighter uppercase">{exp.duration}</span>
                    </div>
                    <p className="text-[10.5pt] font-semibold text-gray-700 mb-2">{exp.company}</p>
                    <ul className="space-y-1.5">
                      {exp.bullets?.map((bullet: string, j: number) => (
                        <li key={j} className="flex gap-2 text-[10pt] text-gray-600 leading-snug">
                          <span style={{ color: TECH_BLUE }}>&gt;</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: TECH_BLUE }}>Featured Projects</h2>
              <div className="space-y-5">
                {projects.map((proj: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-[11.5pt] text-gray-900">{proj.title}</h3>
                      {proj.link && <span className="text-[9pt] font-medium" style={{ color: TECH_BLUE }}>[Github]</span>}
                    </div>
                    {proj.techStack && (
                       <p className="text-[9pt] font-mono mb-2" style={{ color: TECH_BLUE }}>
                          {Array.isArray(proj.techStack) ? proj.techStack.join(" / ") : proj.techStack}
                       </p>
                    )}
                    {proj.description && <p className="text-[10pt] text-gray-600 mb-2">{proj.description}</p>}
                    <ul className="space-y-1">
                      {proj.bullets?.map((bullet: string, j: number) => (
                        <li key={j} className="flex gap-2 text-[9.5pt] text-gray-500 leading-tight">
                          <span style={{ color: TECH_BLUE }}>&gt;</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="flex-1 pl-8 border-l-2 border-gray-100 space-y-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: TECH_BLUE }}>Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[9pt] font-medium text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: TECH_BLUE }}>Education</h2>
              <div className="space-y-4">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <p className="font-bold text-[10.5pt] text-gray-900 leading-tight">{edu.school}</p>
                    <p className="text-[9.5pt] text-gray-700 mt-0.5">{edu.degree}</p>
                    <p className="text-[8.5pt] text-gray-400 font-medium mt-1 uppercase tracking-wider">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: TECH_BLUE }}>Languages</h2>
              <div className="space-y-2">
                {languages.map((lang: any, i: number) => (
                  <div key={i} className="text-[10pt] text-gray-700 flex justify-between">
                    <span className="font-semibold">{lang.language}</span>
                    <span className="text-gray-400 italic">({lang.proficiency})</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: TECH_BLUE }}>Certs</h2>
              <div className="space-y-3">
                {certifications.map((cert: any, i: number) => (
                  <div key={i}>
                    <p className="font-bold text-[9pt] text-gray-800 leading-tight">{cert.name}</p>
                    <p className="text-[8.5pt] text-gray-500 mt-0.5">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
