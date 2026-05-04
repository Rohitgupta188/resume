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

const SLATE_900 = "#0f172a";
const SLATE_800 = "#1e293b";
const SLATE_700 = "#334155";
const SLATE_600 = "#475569";
const SLATE_500 = "#64748b";
const SLATE_400 = "#94a3b8";
const SLATE_300 = "#cbd5e1";
const SLATE_200 = "#e2e8f0";
const SLATE_100 = "#f1f5f9";
const SLATE_50 = "#f8fafc";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: SLATE_800,
    lineHeight: 1.5,
  },

  /* ── Header ── */
  header: {
    backgroundColor: SLATE_900,
    color: "#ffffff",
    padding: "30 40",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    gap: 2,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: -0.5,
    color: "#ffffff",
    marginBottom: 30,
  },
  role: {
    fontSize: 14,
    fontWeight: 500,
    color: SLATE_400,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  headerContact: {
    fontSize: 9,
    color: SLATE_400,
  },
  headerEmail: {
    fontSize: 10,
    fontWeight: 700,
    color: "#ffffff",
  },

  /* ── Body Layout ── */
  body: {
    flexDirection: "row",
    padding: 40,
    gap: 40,
  },
  main: {
    flex: 2,
  },
  sidebar: {
    flex: 1,
  },

  /* ── Sections ── */
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: SLATE_900,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  sectionTitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: SLATE_100,
  },

  /* ── Items ── */
  itemBlock: {
    marginBottom: 20,
    paddingLeft: 15,
    borderLeftWidth: 2,
    borderLeftColor: SLATE_200,
    position: "relative",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: SLATE_900,
  },
  itemCompany: {
    fontSize: 10,
    fontWeight: 700,
    color: SLATE_600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  itemDate: {
    fontSize: 8.5,
    fontWeight: 700,
    color: SLATE_500,
    backgroundColor: SLATE_50,
    padding: "2 6",
    borderRadius: 4,
  },

  /* ── Bullets ── */
  bulletList: {
    gap: 6,
  },
  bulletItem: {
    flexDirection: "row",
    gap: 8,
  },
  bulletDot: {
    fontSize: 10,
    fontWeight: 700,
    color: SLATE_900,
  },
  bulletText: {
    fontSize: 10,
    color: SLATE_600,
    lineHeight: 1.4,
    flex: 1,
  },

  /* ── Sidebar ── */
  sidebarSection: {
    backgroundColor: SLATE_50,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 8.5,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: SLATE_900,
    marginBottom: 12,
  },
  sidebarList: {
    gap: 6,
  },
  sidebarItem: {
    fontSize: 9.5,
    fontWeight: 600,
    color: SLATE_600,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff",
    paddingBottom: 2,
  },
  eduItem: {
    marginBottom: 12,
  },
  eduSchool: {
    fontSize: 10,
    fontWeight: 700,
    color: SLATE_900,
  },
  eduDegree: {
    fontSize: 9,
    color: SLATE_500,
    marginTop: 2,
  },
  eduYear: {
    fontSize: 8.5,
    fontWeight: 700,
    color: SLATE_400,
    marginTop: 2,
  },
});

import { ResumeDocumentProps } from "../types";

export function ExecutiveTemplate({ content }: ResumeDocumentProps) {
  const {
    personalInfo = {},
    summary = "",
    skills = [],
    experience = [],
    education = [],
    projects = [],
    languages = [],
    certifications = [],
  } = content;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{personalInfo.name ?? "YOUR NAME"}</Text>
            <Text style={styles.role}>
              {experience[0]?.role || "Executive Leader"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerContact}>{personalInfo.location}</Text>
            <Text style={styles.headerEmail}>{personalInfo.email}</Text>
            <Text style={styles.headerContact}>{personalInfo.phone}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* MAIN COLUMN */}
          <View style={styles.main}>
            {/* SUMMARY */}
            {summary && (
              <View style={styles.section}>
                <View style={styles.sectionTitle}>
                  <Text>Professional Profile</Text>
                  <View style={styles.sectionTitleLine} />
                </View>
                <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{summary}</Text>
              </View>
            )}

            {/* EXPERIENCE */}
            {experience.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitle}>
                  <Text>Executive Experience</Text>
                  <View style={styles.sectionTitleLine} />
                </View>
                <View style={{ gap: 20 }}>
                  {experience.map((exp, i) => (
                    <View key={i} style={styles.itemBlock}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{exp.role ?? ""}</Text>
                        <Text style={styles.itemDate}>
                          {exp.duration ?? ""}
                        </Text>
                      </View>
                      <Text style={styles.itemCompany}>
                        {exp.company ?? ""}
                      </Text>
                      <View style={styles.bulletList}>
                        {exp.bullets?.map((bullet, j) => (
                          <View key={j} style={styles.bulletItem}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>{bullet}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* SIDEBAR */}
          <View style={styles.sidebar}>
            {/* COMPETENCIES */}
            {skills.length > 0 && (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarTitle}>Competencies</Text>
                <View style={styles.sidebarList}>
                  {skills.map((skill, i) => (
                    <Text key={i} style={styles.sidebarItem}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* ACADEMIC */}
            {education.length > 0 && (
              <View style={{ padding: 5 }}>
                <Text style={styles.sidebarTitle}>Academic Credentials</Text>
                {education.map((edu, i) => (
                  <View key={i} style={styles.eduItem}>
                    <Text style={styles.eduSchool}>{edu.school}</Text>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                    <Text style={styles.eduYear}>{edu.year}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* STRATEGIC PROJECTS */}
            {projects.length > 0 && (
              <View style={{ padding: 5, marginTop: 10 }}>
                <Text style={styles.sidebarTitle}>Strategic Projects</Text>
                {projects.map((proj, i) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 9.5, fontWeight: 700 }}>
                      {proj.title}
                    </Text>
                    <Text
                      style={{ fontSize: 8.5, color: SLATE_500, marginTop: 2 }}
                    >
                      {proj.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
