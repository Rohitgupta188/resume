"use client";

import React from "react";

export function ExecutivePreview({ content }: { content: any }) {
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

  return (
    <div className="h-full flex flex-col font-sans bg-white text-[#1e293b]">
      {/* EXECUTIVE HEADER - Full width color block */}
      <header className="bg-[#0f172a] text-white p-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight">{personalInfo.name || "YOUR NAME"}</h1>
            <p className="text-[#94a3b8] text-lg font-medium tracking-wide uppercase">
              {experience[0]?.role || "Executive Leader"}
            </p>
          </div>
          <div className="text-right text-[10pt] text-[#94a3b8] space-y-1">
            <p>{personalInfo.location}</p>
            <p className="text-white font-bold">{personalInfo.email}</p>
            <p>{personalInfo.phone}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex p-10 gap-10">
        {/* MAIN COLUMN */}
        <div className="flex-2 space-y-10">
          {/* SUMMARY */}
          {summary && (
            <section>
              <h2 className="text-[10pt] font-black uppercase tracking-[0.2em] text-[#0f172a] mb-3 flex items-center gap-2">
                 Professional Profile
                 <div className="h-[2px] flex-1 bg-[#f1f5f9]" />
              </h2>
              <p className="text-[11pt] leading-relaxed text-[#334155]">{summary}</p>
            </section>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-[10pt] font-black uppercase tracking-[0.2em] text-[#0f172a] mb-6 flex items-center gap-2">
                 Executive Experience
                 <div className="h-[2px] flex-1 bg-[#f1f5f9]" />
              </h2>
              <div className="space-y-8">
                {experience.map((exp: any, i: number) => (
                  <div key={i} className="relative pl-6 border-l-2 border-[#e2e8f0]">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-[#0f172a]" />
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-bold text-[13pt] text-[#0f172a]">{exp.role}</h3>
                      <span className="text-[9pt] font-bold text-[#64748b] bg-[#f8fafc] px-2 py-1 rounded">{exp.duration}</span>
                    </div>
                    <div className="text-[11pt] font-bold text-[#475569] mb-3 tracking-wide">{exp.company?.toUpperCase()}</div>
                    <ul className="space-y-2">
                      {exp.bullets?.map((bullet: string, j: number) => (
                        <li key={j} className="text-[10.5pt] text-[#475569] leading-normal list-none flex gap-3">
                           <span className="text-[#0f172a] font-bold">•</span>
                           {bullet}
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
        <div className="flex-1 space-y-10">
          {/* CORE COMPETENCIES */}
          {skills.length > 0 && (
            <section className="bg-[#f8fafc] p-6 rounded-2xl">
              <h2 className="text-[9pt] font-black uppercase tracking-[0.2em] text-[#0f172a] mb-4">Competencies</h2>
              <div className="flex flex-col gap-2">
                {skills.map((skill: string, i: number) => (
                  <div key={i} className="text-[10pt] font-semibold text-[#475569] border-b border-white pb-1 flex justify-between group">
                    {skill}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section className="p-2">
              <h2 className="text-[9pt] font-black uppercase tracking-[0.2em] text-[#0f172a] mb-4">Academic Credentials</h2>
              <div className="space-y-4">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <div className="font-bold text-[11pt] text-[#0f172a]">{edu.school}</div>
                    <p className="text-[10pt] text-[#64748b] leading-tight mt-1">{edu.degree}</p>
                    <p className="text-[9pt] font-bold text-[#94a3b8] mt-1">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <section className="p-2">
              <h2 className="text-[9pt] font-black uppercase tracking-[0.2em] text-[#0f172a] mb-4">Strategic Projects</h2>
              <div className="space-y-4">
                {projects.map((proj: any, i: number) => (
                  <div key={i}>
                    <div className="font-bold text-[10pt] text-[#0f172a]">{proj.title}</div>
                    <p className="text-[9pt] text-[#64748b] line-clamp-2 mt-1">{proj.description}</p>
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
