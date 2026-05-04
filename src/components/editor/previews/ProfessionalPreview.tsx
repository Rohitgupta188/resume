"use client";

import React from "react";

export function ProfessionalPreview({ content }: { content: any }) {
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
    <div className="p-[40pt] h-full flex flex-col font-serif bg-white text-[#1a1a1a]">
      {/* HEADER - Top Alignment */}
      <header className="mb-6 flex flex-col items-start gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-none">
          {personalInfo.name || "YOUR NAME"}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 text-[11pt] text-gray-600">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && <span className="underline decoration-gray-300 underline-offset-2">• {personalInfo.email}</span>}
        </div>
        <div className="flex gap-4 mt-1 text-[10pt] font-medium text-gray-500">
          {personalInfo.linkedin && <span>LinkedIn</span>}
          {personalInfo.portfolio && <span>Portfolio</span>}
        </div>
      </header>

      {/* SUMMARY - Classic Border Top */}
      {summary && (
        <section className="mb-6 border-t-2 border-gray-900 pt-3">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-2 text-gray-900">Professional Summary</h2>
          <p className="text-[11pt] leading-normal text-gray-700 text-justify italic font-sans">{summary}</p>
        </section>
      )}

      {/* EXPERIENCE - Main Body */}
      {experience.length > 0 && (
        <section className="mb-6 border-t border-gray-200 pt-3">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-gray-900">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp: any, i: number) => (
              <div key={i} className="group">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[12pt] text-gray-900">{exp.company}</h3>
                  <span className="text-[10pt] text-gray-600 font-medium italic">{exp.duration}</span>
                </div>
                <div className="text-[11pt] font-semibold text-gray-700 mb-2">{exp.role}</div>
                <ul className="list-disc list-outside ml-5 space-y-1.5">
                  {exp.bullets?.map((bullet: string, j: number) => (
                    <li key={j} className="text-[10.5pt] text-gray-700 leading-snug pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-12 gap-8 border-t border-gray-200 pt-3">
        {/* LEFT COLUMN */}
        <div className="col-span-8 space-y-6">
          {/* PROJECTS */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-gray-900">Projects</h2>
              <div className="space-y-4">
                {projects.map((proj: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-[11pt] text-gray-800">{proj.title}</h3>
                      {proj.link && <span className="text-[9pt] underline text-gray-500">Link</span>}
                    </div>
                    <ul className="list-square list-outside ml-4 space-y-1">
                      {proj.bullets?.slice(0, 2).map((bullet: string, j: number) => (
                        <li key={j} className="text-[10pt] text-gray-600 leading-tight">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-gray-900">Education</h2>
              <div className="space-y-3">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[11pt] text-gray-800">{edu.school}</h3>
                      <span className="text-[10pt] text-gray-500">{edu.year}</span>
                    </div>
                    <p className="text-[10pt] text-gray-600 italic">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN - Sidebar style for skills/certs */}
        <div className="col-span-4 space-y-6">
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-gray-900">Expertise</h2>
              <div className="flex flex-col gap-1.5">
                {skills.map((skill: string, i: number) => (
                  <div key={i} className="text-[10pt] text-gray-700 flex items-center gap-2">
                    <div className="h-1 w-1 bg-gray-400 rounded-full" />
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-gray-900">Awards</h2>
              <div className="space-y-3">
                {certifications.map((cert: any, i: number) => (
                  <div key={i}>
                    <div className="font-bold text-[10pt] text-gray-800 leading-tight">{cert.name}</div>
                    <div className="text-[9pt] text-gray-500">{cert.issuer}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-3 text-gray-900">Languages</h2>
              <div className="space-y-1">
                {languages.map((lang: any, i: number) => (
                  <div key={i} className="text-[10pt] text-gray-700">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-gray-400"> — {lang.proficiency}</span>
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
