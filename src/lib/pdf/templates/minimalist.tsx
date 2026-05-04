import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Link,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Inter",
    fontSize: 10,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 40,
    textAlign: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: 400,
    textTransform: "uppercase",
    letterSpacing: 6,
    color: "#030712",
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    fontSize: 9,
    color: "#6b7280",
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  summarySection: {
    marginBottom: 35,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  summary: {
    fontSize: 10.5,
    lineHeight: 1.6,
    color: "#4b5563",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 3,
    color: "#9ca3af",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 4,
    width: "auto",
    alignSelf: "flex-start",
  },
  itemBlock: {
    marginBottom: 20,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 11.5,
    fontWeight: 700,
    color: "#111827",
  },
  itemSubtitle: {
    fontSize: 10.5,
    color: "#6b7280",
    marginBottom: 6,
  },
  itemDate: {
    fontSize: 8.5,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    color: "#d1d5db",
    width: 12,
    fontSize: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  projectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  projectItem: {
    width: "47%",
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    marginBottom: 2,
  },
  projectDesc: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.4,
    marginBottom: 4,
  },
  techStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  techTag: {
    fontSize: 7.5,
    color: "#9ca3af",
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    padding: "1 4",
    borderRadius: 2,
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    gap: 40,
  },
  gridCol: {
    flex: 1,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillText: {
    fontSize: 9.5,
    color: "#4b5563",
  },
});

import { ResumeDocumentProps } from "../types";

export function MinimalistTemplate({ content }: ResumeDocumentProps) {
  const {
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
  } = content;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name ?? "YOUR NAME"}</Text>
          <View style={styles.contactRow}>
            {personalInfo.location && <Text>{personalInfo.location}</Text>}
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
          </View>
        </View>

        {/* SUMMARY */}
        {summary && (
          <View style={styles.summarySection}>
            <Text style={styles.summary}>{summary}</Text>
          </View>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp: any, i: number) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.company ?? ""}</Text>
                  <Text style={styles.itemDate}>{exp.duration ?? ""}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.role ?? ""}</Text>
                {exp.bullets?.map((bullet: string, j: number) => (
                  <View key={j} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <View style={styles.projectsGrid}>
              {projects.map((proj: any, i: number) => (
                <View key={i} style={styles.projectItem}>
                  <Text style={styles.projectTitle}>{proj.title}</Text>
                  {proj.description && (
                    <Text style={styles.projectDesc}>{proj.description}</Text>
                  )}
                  <View style={styles.techStack}>
                    {Array.isArray(proj.techStack) &&
                      proj.techStack.map((tech: string, j: number) => (
                        <Text key={j} style={styles.techTag}>
                          {tech}
                        </Text>
                      ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* BOTTOM GRID */}
        <View style={styles.grid}>
          {/* EDUCATION */}
          {education.length > 0 && (
            <View style={styles.gridCol}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu: any, i: number) => (
                  <View key={i} style={{ marginBottom: 12 }}>
                    <Text style={styles.itemTitle}>{edu.school}</Text>
                    <Text style={styles.itemSubtitle}>{edu.degree}</Text>
                    <Text style={styles.itemDate}>{edu.year}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <View style={styles.gridCol}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsList}>
                  {skills.map((skill: string, i: number) => (
                    <Text key={i} style={styles.skillText}>
                      {skill}
                      {i < skills.length - 1 ? "  ·" : ""}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.skillsList}>
              {languages.map((lang: any, i: number) => (
                <Text key={i} style={styles.skillText}>
                  {typeof lang === "string" ? lang : `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ""}`}
                  {i < languages.length - 1 ? "  ·" : ""}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
