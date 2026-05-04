"use client";

import React from "react";

export function CreativePreview({ content }: { content: any }) {
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

  const ACCENT = "#0d9488"; // Teal-600
  const DARK = "#1e293b";   // Slate-800

  return (
    <div className="h-full flex font-sans bg-white shadow-lg">
      {/* SIDEBAR */}
      <div className="w-[32%] bg-[#1e293b] text-white p-8 flex flex-col gap-10">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.25em] mb-4 text-[#0d9488] border-b border-[#0d9488] pb-1">Contact</h2>
          <div className="space-y-3 text-[9pt] text-slate-300 wrap-break-word">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <p className="text-teal-400 font-medium cursor-pointer">LinkedIn</p>}
            {personalInfo.portfolio && <p className="text-teal-400 font-medium cursor-pointer">Portfolio</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.25em] mb-4 text-[#0d9488] border-b border-[#0d9488] pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-teal-900/30 text-teal-200 rounded text-[8.5pt] font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.25em] mb-4 text-[#0d9488] border-b border-[#0d9488] pb-1">Languages</h2>
            <div className="space-y-2 text-[9.5pt] text-slate-300">
              {languages.map((lang: any, i: number) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-semibold">{lang.language}</span>
                  <span className="text-[8.5pt] text-slate-500 italic">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.25em] mb-4 text-[#0d9488] border-b border-[#0d9488] pb-1">Awards</h2>
            <div className="space-y-4">
              {certifications.map((cert: any, i: number) => (
                <div key={i}>
                  <p className="font-bold text-[9.5pt] text-teal-100 leading-tight">{cert.name}</p>
                  <p className="text-[8.5pt] text-slate-400 mt-1 uppercase tracking-wider">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 flex flex-col">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#1e293b] tracking-tighter uppercase mb-4">
            {personalInfo.name || "CREATIVE MIND"}
          </h1>
          {summary && (
             <p className="text-[11pt] leading-relaxed text-slate-600 font-medium border-l-4 border-[#0d9488] pl-6 py-1">
                {summary}
             </p>
          )}
        </header>

        <div className="space-y-10">
          {experience.length > 0 && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.25em] mb-6 text-[#1e293b] flex items-center gap-4">
                <span className="bg-[#0d9488] text-white px-3 py-1 rounded-sm">Experience</span>
                <div className="h-px flex-1 bg-slate-100" />
              </h2>
              <div className="space-y-8 pl-4">
                {experience.map((exp: any, i: number) => (
                  <div key={i} className="relative border-l-2 border-slate-50 pl-8 pb-2">
                    <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-white border-4 border-[#0d9488]" />
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-extrabold text-[12.5pt] text-slate-800">{exp.role}</h3>
                      <span className="text-[9.5pt] font-bold text-[#0d9488] bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">{exp.duration}</span>
                    </div>
                    <p className="text-[11pt] font-bold text-slate-500 mb-3 uppercase tracking-wide">{exp.company}</p>
                    <ul className="space-y-2">
                      {exp.bullets?.map((bullet: string, j: number) => (
                        <li key={j} className="flex gap-2 text-[10.5pt] text-slate-600 leading-snug">
                          <span className="text-[#0d9488] font-bold">›</span>
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
              <h2 className="text-sm font-black uppercase tracking-[0.25em] mb-6 text-[#1e293b] flex items-center gap-4">
                <span className="bg-[#0d9488] text-white px-3 py-1 rounded-sm">Projects</span>
                <div className="h-px flex-1 bg-slate-100" />
              </h2>
              <div className="grid grid-cols-1 gap-6 pl-4">
                {projects.map((proj: any, i: number) => (
                  <div key={i} className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {proj.link && <span className="text-[9pt] font-black text-[#0d9488] uppercase tracking-widest cursor-pointer">Live View</span>}
                    </div>
                    <h3 className="font-black text-[12pt] text-slate-800 mb-2">{proj.title}</h3>
                    {proj.description && <p className="text-[10pt] text-slate-500 leading-relaxed mb-4">{proj.description}</p>}
                    <div className="flex flex-wrap gap-2">
                       {Array.isArray(proj.techStack) && proj.techStack.map((tech: string, j: number) => (
                          <span key={j} className="text-[8.5pt] font-bold text-slate-400 uppercase tracking-widest">{tech}</span>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.25em] mb-6 text-[#1e293b] flex items-center gap-4">
                <span className="bg-[#0d9488] text-white px-3 py-1 rounded-sm">Education</span>
                <div className="h-px flex-1 bg-slate-100" />
              </h2>
              <div className="space-y-6 pl-4">
                {education.map((edu: any, i: number) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p className="font-extrabold text-[12pt] text-slate-800 leading-tight">{edu.school}</p>
                      <p className="text-[10.5pt] text-slate-500 font-medium mt-1">{edu.degree}</p>
                    </div>
                    <span className="text-[10pt] font-black text-slate-300">{edu.year}</span>
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
