"use client";

import React from "react";

export function MinimalistPreview({ content }: { content: any }) {
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
    <div className="p-[50pt] h-full flex flex-col font-sans bg-white text-gray-900 leading-relaxed">
      {/* HEADER - Centered and Minimal */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-light tracking-widest text-gray-950 mb-3">
          {personalInfo.name?.toUpperCase() || "YOUR NAME"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-[10pt] text-gray-500 font-medium tracking-wide">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
        </div>
      </header>

      {/* SUMMARY */}
      {summary && (
        <section className="mb-10 text-center max-w-[80%] mx-auto">
          <p className="text-[11pt] text-gray-600 font-normal italic leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* MAIN SECTIONS - Unified minimal styling */}
      <div className="space-y-12">
        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-[9pt] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b pb-1 inline-block">Experience</h2>
            <div className="space-y-10">
              {experience.map((exp: any, i: number) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-[12pt]">{exp.company}</h3>
                    <span className="text-[9pt] text-gray-400 uppercase tracking-wider">{exp.duration}</span>
                  </div>
                  <div className="text-[10.5pt] text-gray-500 mb-3">{exp.role}</div>
                  <ul className="space-y-2">
                    {exp.bullets?.map((bullet: string, j: number) => (
                      <li key={j} className="text-[10pt] text-gray-600 flex gap-3">
                        <span className="text-gray-300">•</span>
                        {bullet}
                      </li>
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
            <h2 className="text-[9pt] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b pb-1 inline-block">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {projects.map((proj: any, i: number) => (
                <div key={i} className="space-y-1">
                  <h3 className="font-semibold text-[11pt]">{proj.title}</h3>
                  <p className="text-[10pt] text-gray-500 mb-2">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {proj.techStack?.map((tech: string, j: number) => (
                      <span key={j} className="text-[8pt] text-gray-400 border px-1.5 py-0.5 rounded uppercase tracking-tighter">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GRID: EDUCATION & SKILLS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {education.length > 0 && (
            <section>
              <h2 className="text-[9pt] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b pb-1 inline-block">Education</h2>
              <div className="space-y-6">
                {education.map((edu: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <h3 className="font-semibold text-[11pt]">{edu.school}</h3>
                    <p className="text-[10pt] text-gray-600">{edu.degree}</p>
                    <p className="text-[9pt] text-gray-400 uppercase">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-[9pt] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b pb-1 inline-block">Skills</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {skills.map((skill: string, i: number) => (
                  <span key={i} className="text-[10pt] text-gray-600">{skill}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
