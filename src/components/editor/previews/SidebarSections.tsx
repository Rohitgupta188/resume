"use client";

import React from "react";
import { CustomSectionsBlock } from "./CustomSectionsBlock";

type Props = {
  id: string;
  scale: number;
  SectionTitle: ({
    children,
  }: {
    children: React.ReactNode;
  }) => React.ReactElement;

  data: {
    skills?: string[];
    education?: any[];
    certifications?: any[];
    languages?: any[];
    customSections?: any[];
  };

  variant?: "tech" | "minimal" | "modern";
};

export function renderSidebarSection({
  id,
  scale,
  SectionTitle,
  data,
  variant = "tech",
}: Props) {
  const {
    skills = [],
    education = [],
    certifications = [],
    languages = [],
    customSections = [],
  } = data;

  switch (id) {
    case "skills":
      return (
        skills.length > 0 && (
          <section key="skills">
            <SectionTitle>skills</SectionTitle>

            <div className="space-y-[6px]">
              {skills.map((skill: string, i: number) => (
                <div
                  key={i}
                  className="px-[6px] py-[3px] bg-[#f3f4f6] text-[#111827] rounded-sm border border-[#d1d5db]"
                  style={{
                    fontSize: `${9 * scale}pt`,
                  }}
                >
                  {skill}
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
            <SectionTitle>education</SectionTitle>

            <div className="space-y-[10pt]">
              {education.map((edu: any, i: number) => (
                <div key={i}>
                  <p
                    className="font-bold text-[#111827]"
                    style={{ fontSize: `${9.5 * scale}pt` }}
                  >
                    {edu.school}
                  </p>

                  <p
                    className="text-[#374151]"
                    style={{ fontSize: `${9 * scale}pt` }}
                  >
                    {edu.degree}
                  </p>
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
            <SectionTitle>certs</SectionTitle>

            <div className="space-y-[8pt]">
              {certifications.map((cert: any, i: number) => (
                <div key={i}>
                  <p
                    className="font-bold"
                    style={{ fontSize: `${9 * scale}pt` }}
                  >
                    {cert.name}
                  </p>
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
            <SectionTitle>languages</SectionTitle>

            <div className="space-y-[4px]">
              {languages.map((l: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between"
                  style={{ fontSize: `${8.5 * scale}pt` }}
                >
                  <span>{l.language}</span>
                  <span>{l.proficiency}</span>
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
}
