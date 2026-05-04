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

const TECH_BLUE = "#0891b2"; // Cyan-600
const BORDER_COLOR = "#e5e7eb";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Inter",
    fontSize: 9.5,
    color: "#1f2937",
    lineHeight: 1.4,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: TECH_BLUE,
    paddingBottom: 10,
    marginBottom: 16,
  },

  name: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 2,
  },

  contactGrid: {
    alignItems: "flex-end",
    gap: 2,
  },

  contactItem: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.3,
  },

  linkSmall: {
    fontSize: 9,
    color: TECH_BLUE,
  },

  /* BODY */
  body: {
    flexDirection: "row",
    gap: 16,
  },

  left: {
    flex: 2.5,
  },

  right: {
    flex: 1,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: BORDER_COLOR,
  },

  /* SECTION */
  section: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: TECH_BLUE,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  /* TEXT */
  paragraph: {
    lineHeight: 1.45,
  },

  paragraphSmall: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2,
  },

  /* ITEMS */
  itemBlock: {
    marginBottom: 10,
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1,
  },

  itemTitle: {
    fontWeight: 700,
    fontSize: 10,
  },

  itemSubtitle: {
    fontSize: 9.5,
    color: "#4b5563",
    marginBottom: 2,
  },

  itemDate: {
    fontSize: 8.5,
    color: "#6b7280",
  },

  techStack: {
    fontSize: 8.5,
    color: TECH_BLUE,
    marginBottom: 2,
  },

  /* BULLETS */
  bulletRow: {
    flexDirection: "row",
    marginTop: 1,
  },

  bullet: {
    width: 8,
    fontSize: 8,
    color: TECH_BLUE,
  },

  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.35,
  },

  /* SKILLS */
  skillTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },

  skillTag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 8.5,
    borderWidth: 0.5,
    borderColor: "#d1d5db",
    marginBottom: 4,
  },

  /* LINKS */
  link: {
    fontSize: 8.5,
    color: TECH_BLUE,
    fontWeight: 600,
  },
});


import { ResumeDocumentProps } from "../types";

export function TechTemplate({ content }: ResumeDocumentProps) {
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
          <View>
            <Text style={styles.name}>{personalInfo.name ?? ""}</Text>
            {personalInfo.portfolio && (
              <Link
                src={personalInfo.portfolio}
                style={[styles.link, { fontSize: 10, marginTop: 4 }]}
              >
                {personalInfo.portfolio}
              </Link>
            )}
          </View>
          <View style={styles.contactGrid}>
            <Text style={styles.contactItem}>{personalInfo.email ?? ""}</Text>
            <Text style={styles.contactItem}>{personalInfo.phone ?? ""}</Text>
            {personalInfo.linkedin && (
              <Link src={personalInfo.linkedin} style={styles.link}>
                linkedin.com/in/profile
              </Link>
            )}
            <Text style={styles.contactItem}>
              {personalInfo.location ?? ""}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* MAIN COLUMN */}
          <View style={styles.left}>
            {summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile</Text>
                <Text style={{ lineHeight: 1 }}>{summary}</Text>
              </View>
            )}

            {experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {experience.map((exp, i) => (
                  <View key={i} style={styles.itemBlock}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{exp.role ?? ""}</Text>
                      <Text style={styles.itemDate}>{exp.duration ?? ""}</Text>
                    </View>
                    <Text style={styles.itemSubtitle}>{exp.company ?? ""}</Text>
                    {exp.bullets?.map((bullet, j) => (
                      <View key={j} style={styles.bulletRow}>
                        <Text style={styles.bullet}>{">"}</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Projects</Text>
                {projects.map((proj, i) => (
                  <View key={i} style={styles.itemBlock}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{proj.title ?? ""}</Text>
                      {proj.link && (
                        <Link src={proj.link} style={styles.link}>
                          [Github]
                        </Link>
                      )}
                    </View>
                    {proj.techStack && (
                      <Text
                        style={{
                          color: TECH_BLUE,
                          fontSize: 8.5,
                          marginBottom: 2,
                        }}
                      >
                        {Array.isArray(proj.techStack)
                          ? proj.techStack.join(" / ")
                          : proj.techStack}
                      </Text>
                    )}
                    {proj.description && (
                      <Text style={{ marginBottom: 2 }}>
                        {proj.description}
                      </Text>
                    )}
                    {proj.bullets?.map((bullet, j) => (
                      <View key={j} style={styles.bulletRow}>
                        <Text style={styles.bullet}>{">"}</Text>
                        <Text style={{marginBottom: 2,}}></Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* SIDEBAR COLUMN */}
          <View style={styles.right}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillTags}>
                {skills.map((skill, i) => (
                  <View key={i} style={styles.skillTag}>
                    <Text>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu, i) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 700 }}>{edu.school ?? ""}</Text>
                    <Text style={{ fontSize: 9 }}>{edu.degree ?? ""}</Text>
                    <Text style={styles.itemDate}>{edu.year ?? ""}</Text>
                  </View>
                ))}
              </View>
            )}

            {languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {languages.map((lang, i) => (
                  <Text key={i} style={{ marginBottom: 2 }}>
                    {lang.language ?? ""}{" "}
                    <Text style={{ color: "#6b7280" }}>
                      ({lang.proficiency ?? ""})
                    </Text>
                  </Text>
                ))}
              </View>
            )}

            {certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certs</Text>
                {certifications.map((cert, i) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={{ fontWeight: 600, fontSize: 8.5 }}>
                      {cert.name ?? ""}
                    </Text>
                    <Text style={{ fontSize: 8, color: "#6b7280" }}>
                      {cert.issuer ?? ""}
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
