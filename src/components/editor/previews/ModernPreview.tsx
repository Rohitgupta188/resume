"use client";

import React from "react";

export function ModernPreview({ content }: { content: any }) {
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
    <div className="p-[40pt] h-full flex flex-col font-sans">
      {/* HEADER */}
      <header className="mb-8 border-b-2 border-primary pb-6 text-center">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-2">{personalInfo.name || "YOUR NAME"}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.linkedin && <span className="text-primary font-medium">LinkedIn</span>}
          {personalInfo.portfolio && <span className="text-primary font-medium">Portfolio</span>}
        </div>
      </header>

      {/* SUMMARY */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase text-primary border-b mb-2 tracking-wide">Summary</h2>
          <p className="text-sm leading-relaxed text-gray-800 text-justify">{summary}</p>
        </section>
      )}

      <div className="flex-1 flex flex-col gap-6">
        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase text-primary border-b mb-3 tracking-wide">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-gray-900">{exp.role}</h3>
                    <span className="text-xs text-gray-500 font-medium">{exp.duration}</span>
                  </div>
                  <p className="text-sm font-semibold text-primary/80 mb-1.5">{exp.company}</p>
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {exp.bullets?.map((bullet: string, j: number) => (
                      <li key={j} className="text-[13px] text-gray-700 leading-snug">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase text-primary border-b mb-3 tracking-wide">Projects</h2>
            <div className="space-y-3">
              {projects.map((proj: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-sm">{proj.title}</h3>
                    {proj.link && <span className="text-[10px] text-primary italic">{proj.link}</span>}
                  </div>
                  {proj.description && <p className="text-xs italic text-gray-600 mb-1">{proj.description}</p>}
                  <ul className="list-disc list-outside ml-4 space-y-0.5">
                    {proj.bullets?.map((bullet: string, j: number) => (
                      <li key={j} className="text-xs text-gray-700 leading-snug">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS, CERTIFICATIONS, LANGUAGES GRID */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-100">
           {skills.length > 0 && (
              <div className="col-span-full">
                 <h2 className="text-xs font-bold uppercase text-primary tracking-widest mb-2"> Skills</h2>
                 <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {skills.map((skill: string, i: number) => (
                       <span key={i} className="text-xs text-gray-700">{skill}{i < skills.length - 1 ? " •" : ""}</span>
                    ))}
                 </div>
              </div>
           )}

           {certifications.length > 0 && (
              <div>
                 <h2 className="text-xs font-bold uppercase text-primary tracking-widest mb-2">Certifications</h2>
                 <div className="space-y-1">
                    {certifications.map((cert: any, i: number) => (
                       <div key={i} className="text-xs">
                          <span className="font-bold text-gray-800">{cert.name}</span>
                          <p className="text-[10px] text-gray-500">{cert.issuer} • {cert.date}</p>
                       </div>
                    ))}
                 </div>
              </div>
           )}

                   {/* EDUCATION */}
        {education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase text-primary border-b mb-3 tracking-wide">Education</h2>
            <div className="space-y-2">
              {education.map((edu: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-sm">{edu.school}</h3>
                    <p className="text-xs text-gray-700">{edu.degree}</p>
                  </div>
                  <span className="text-xs text-gray-500">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

           {languages.length > 0 && (
              <div>
                 <h2 className="text-xs font-bold uppercase text-primary tracking-widest mb-2">Languages</h2>
                 <div className="flex flex-col gap-1">
                    {languages.map((lang: any, i: number) => (
                       <div key={i} className="text-xs text-gray-700 flex justify-between">
                          <span>{lang.language}</span>
                          <span className="text-[10px] text-gray-400 italic">{lang.proficiency}</span>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
