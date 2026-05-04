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

// Registering fonts
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuPKfAZ9hjQ.ttf",
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

const ACCENT = "#0d9488"; // Teal-600
const DARK = "#1e293b"; // Slate-800
const LIGHT_GRAY = "#f8fafc"; // Slate-50

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Inter",
    fontSize: 10,
    color: "#334155",
    backgroundColor: "#ffffff",
  },

  /* SIDEBAR */
  sidebar: {
    width: "32%",
    backgroundColor: DARK,
    color: "#ffffff",
    padding: 28,
    height: "100%",
  },
  sidebarSection: {
    marginBottom: 25,
  },
  sidebarTitle: {
    fontSize: 9,
    fontWeight: 900,
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: ACCENT,
    paddingBottom: 2,
  },
  sidebarText: {
    fontSize: 9,
    marginBottom: 6,
    color: "#cbd5e1",
    lineHeight: 1.4,
  },
  sidebarLink: {
    fontSize: 9,
    color: "#5eead4", // Teal-300
    textDecoration: "none",
    marginBottom: 6,
    fontWeight: 600,
  },
  skillItem: {
    backgroundColor: "rgba(13, 148, 136, 0.25)",
    // FIX: React-PDF does not support string shorthands like "3 7"
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
    marginBottom: 5,
    fontSize: 8.5,
    fontWeight: 600,
    color: "#ffffff",
  },

  /* MAIN CONTENT */
  main: {
    width: "68%",
    padding: 35,
  },
  header: {
    marginBottom: 30,
  },
  name: {
    fontSize: 32,
    fontWeight: 900,
    color: DARK,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: -1,
  },
  summaryContainer: {
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
    paddingLeft: 12,
    paddingVertical: 2,
  },
  summary: {
    fontSize: 10.5,
    lineHeight: 1.5,
    color: "#475569",
    fontWeight: 600,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },
  sectionBadge: {
    backgroundColor: ACCENT,
    color: "#ffffff",
    // FIX: Replaced string shorthand
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    fontSize: 9,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#f1f5f9",
  },

  /* ITEMS */
  expItem: {
    marginBottom: 15,
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: "#f1f5f9",
    position: "relative",
  },
  expDot: {
    position: "absolute",
    left: -6,
    top: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: ACCENT,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: DARK,
  },
  itemSubtitle: {
    fontSize: 10.5,
    color: "#64748b",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  itemDate: {
    fontSize: 9,
    fontWeight: 700,
    color: ACCENT,
    backgroundColor: "rgba(13, 148, 136, 0.08)",
    // FIX: Replaced string shorthand
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  bulletDot: {
    color: ACCENT,
    width: 12,
    fontSize: 11,
    fontWeight: 700,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.5,
  },

  /* PROJECTS */
  projectCard: {
    backgroundColor: LIGHT_GRAY,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 11.5,
    fontWeight: 900,
    color: DARK,
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 9.5,
    color: "#64748b",
    lineHeight: 1.5,
    marginBottom: 8,
  },
  projLink: {
    fontSize: 9.5,
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
  },
  techStack: {
    flexDirection: "row",
    gap: 18,
  },
  techItem: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  eduItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  eduSchool: {
    fontSize: 11,
    fontWeight: 700,
    color: DARK,
  },
  eduYear: {
    fontSize: 9,
    fontWeight: 700,
    color: "#cbd5e1",
  },
});

// Assuming you have this defined in a separate file, but included here for context
interface ResumeDocumentProps {
  content?: {
    personalInfo?: any;
    summary?: string;
    skills?: string[];
    experience?: any[];
    education?: any[];
    projects?: any[];
    languages?: any[];
    certifications?: any[];
  };
}

export function CreativeTemplate({ content = {} }: ResumeDocumentProps) {
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
        {/* LEFT SIDEBAR */}
        <View style={styles.sidebar}>
          {/* CONTACT */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            {personalInfo.email && (
              <Text style={styles.sidebarText}>{personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.sidebarText}>{personalInfo.phone}</Text>
            )}
            {personalInfo.location && (
              <Text style={styles.sidebarText}>{personalInfo.location}</Text>
            )}
            {personalInfo.linkedin && (
              <Link src={personalInfo.linkedin} style={styles.sidebarLink}>
                LinkedIn
              </Link>
            )}
            {personalInfo.portfolio && (
              <Link src={personalInfo.portfolio} style={styles.sidebarLink}>
                Portfolio
              </Link>
            )}
          </View>

          {/* SKILLS */}
          {skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Skills</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
                {skills.map((skill: string, i: number) => (
                  <View key={i} style={styles.skillItem}>
                    <Text>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Languages</Text>
              {languages.map((lang: any, i: number) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontWeight: 700, color: "#ffffff", fontSize: 9 }}>
                    {lang.language}
                  </Text>
                  <Text style={{ color: "#64748b", fontSize: 8.5 }}>
                    {lang.proficiency}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Awards</Text>
              {certifications.map((cert: any, i: number) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 700, fontSize: 9.5, color: "#ccfbf1" }}>
                    {cert.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 8,
                      color: "#64748b",
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    {cert.issuer}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* MAIN AREA */}
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.name}>{personalInfo.name ?? "YOUR NAME"}</Text>
            {summary && (
              <View style={styles.summaryContainer}>
                <Text style={styles.summary}>{summary}</Text>
              </View>
            )}
          </View>

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionBadge}>
                  <Text>Experience</Text>
                </View>
                <View style={styles.sectionLine} />
              </View>
              {experience.map((exp: any, i: number) => (
                <View key={i} style={styles.expItem} wrap={false}>
                  <View style={styles.expDot} />
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{exp.role ?? ""}</Text>
                    <Text style={styles.itemDate}>{exp.duration ?? ""}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{exp.company ?? ""}</Text>
                  {exp.bullets?.map((bullet: string, j: number) => (
                    <View key={j} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>›</Text>
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
              <View style={styles.sectionHeader}>
                <View style={styles.sectionBadge}>
                  <Text>Projects</Text>
                </View>
                <View style={styles.sectionLine} />
              </View>
              {projects.map((proj: any, i: number) => (
                <View key={i} style={styles.projectCard} wrap={false}>
                  <Text style={styles.projectTitle}>{proj.title}</Text>
                  {proj.description && (
                    <Text style={styles.projectDesc}>{proj.description}</Text>
                  )}
                  {proj.link && (
                    <Link src={proj.link} style={styles.projLink}>
                      [View project]
                    </Link>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionBadge}>
                  <Text>Education</Text>
                </View>
                <View style={styles.sectionLine} />
              </View>
              {education.map((edu: any, i: number) => (
                <View key={i} style={styles.eduItem} wrap={false}>
                  <View>
                    <Text style={styles.eduSchool}>{edu.school}</Text>
                    <Text style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </Text>
                  </View>
                  <Text style={styles.eduYear}>{edu.year}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}