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

const NAVY = "#1a2744";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    fontFamily: "Inter",
    fontSize: 9.5,
    backgroundColor: "#ffffff",
  },

  /* ── HEADER ── */
  header: {
    paddingTop: 22,
    paddingBottom: 10,
    alignItems: "center",
  },
  headerName: {
    fontSize: 26,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 3,
  },
  headerDivider: {
    marginTop: 6,
    height: 2,
    backgroundColor: NAVY,
    width: "92%",
  },

  /* ── BODY ── */
  body: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  /* LEFT COLUMN */
  left: {
    width: "32%",
    paddingRight: 14,
    borderRightWidth: 1,
    borderRightColor: "#c8ccda",
    borderRightStyle: "solid",
  },

  /* RIGHT COLUMN */
  right: {
    width: "68%",
    paddingLeft: 18,
  },

  /* ── SECTION ── */
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 1.5,
    marginBottom: 5,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
    borderBottomStyle: "solid",
  },

  /* ── CONTACT ── */
  contactItem: {
    color: "#222222",
    marginBottom: 3,
    fontSize: 9,
  },
  link: {
    color: "#1a55b0",
    fontSize: 9,
    textDecoration: "none",
  },

  /* ── EDUCATION ── */
  eduBlock: {
    marginBottom: 9,
  },
  eduSchool: {
    fontWeight: 700,
    color: NAVY,
    fontSize: 9,
    marginBottom: 1,
  },
  eduDegree: {
    fontSize: 9,
    color: "#333333",
  },
  eduYear: {
    fontSize: 8.5,
    color: "#666666",
    marginTop: 1,
  },

  /* ── LANGUAGES ── */
  langItem: {
    fontSize: 9,
    color: "#222222",
    marginBottom: 2,
  },

  /* ── SUMMARY ── */
  summaryText: {
    fontSize: 9,
    color: "#333333",
    lineHeight: 1.6,
    textAlign: "justify",
  },

  /* ── BULLETS ── */
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "flex-start",
  },
  bullet: {
    marginRight: 4,
    color: NAVY,
    fontSize: 9,
  },
  bulletText: {
    fontSize: 9,
    color: "#222222",
    flex: 1,
  },

  /* ── CERTIFICATE ── */
  certText: {
    fontSize: 9,
    color: "#1a55b0",
    textDecoration: "underline",
    marginBottom: 3,
  },
});

import { ResumeDocumentProps } from "../types";

/* ── COMPONENT ── */
export function ProfessionalTemplate({ content }: ResumeDocumentProps) {
  const personalInfo = content.personalInfo ?? {};
  const summary = content.summary ?? "";
  const skills: string[] = Array.isArray(content.skills) ? content.skills : [];
  const education = Array.isArray(content.education) ? content.education : [];
  const languages = Array.isArray(content.languages) ? content.languages : [];
  const hobbies: string[] = Array.isArray(content.hobbies) ? content.hobbies : [];
  const certificates: string[] = Array.isArray(content.certificates) ? content.certificates : [];
  const interests: string[] = Array.isArray(content.interests) ? content.interests : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.headerName}>{personalInfo.name ?? ""}</Text>
          <View style={styles.headerDivider} />
        </View>

        {/* ── BODY ── */}
        <View style={styles.body}>

          {/* ══ LEFT COLUMN ══ */}
          <View style={styles.left}>

            {/* CONTACT */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CONTACT</Text>
              {personalInfo.phone ? (
                <Text style={styles.contactItem}>{personalInfo.phone}</Text>
              ) : null}
              {personalInfo.email ? (
                <Text style={styles.contactItem}>{personalInfo.email}</Text>
              ) : null}
              {personalInfo.linkedin ? (
                <Link src={personalInfo.linkedin} style={styles.link}>
                  {personalInfo.linkedin}
                </Link>
              ) : null}
            </View>

            {/* EDUCATION */}
            {education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>EDUCATION</Text>
                {education.map((edu, i) => (
                  <View key={i} style={styles.eduBlock}>
                    <Text style={styles.eduSchool}>{edu.school}</Text>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                    <Text style={styles.eduYear}>{edu.year}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>LANGUAGES</Text>
                {languages.map((lang, i) => (
                  <Text key={i} style={styles.langItem}>
                    • {lang.language} {lang.proficiency ? `(${lang.proficiency})` : ""}
                  </Text>
                ))}
              </View>
            )}

          </View>

          {/* ══ RIGHT COLUMN ══ */}
          <View style={styles.right}>

            {/* SUMMARY */}
            {summary ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SUMMARY</Text>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            ) : null}

            {/* CERTIFICATE */}
            {certificates.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CERTIFICATE</Text>
                {certificates.map((cert, i) => (
                  <Text key={i} style={styles.certText}>{cert}</Text>
                ))}
              </View>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SKILLS</Text>
                {skills.map((skill, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* KEY INTERESTS */}
            {interests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>KEY INTERESTS</Text>
                {interests.map((item, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* HOBBIES */}
            {hobbies.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>HOBBIES</Text>
                {hobbies.map((hobby, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{hobby}</Text>
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
