import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { ResumeDocumentProps, ResumeContent } from "../types";

/* ────────────────────────────────────────────────
 * Register fonts
 * ──────────────────────────────────────────────── */
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
      fontStyle: "italic",
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

/* ────────────────────────────────────────────────
 * Styles — Spacing Corrected
 * ──────────────────────────────────────────────── */
const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10.5,
    color: "#1a1a1a",
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 44,
    lineHeight: 1.5,
  },

  /* ── Header ── */
  header: {
    alignItems: "center",
    marginBottom: 12, // Reduced to prevent double-spacing with section margins
    paddingBottom: 12,
    borderBottomWidth: 2, // Slightly thinner for a cleaner look
    borderBottomColor: "#1a1a1a",
    borderBottomStyle: "solid",
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  contact: {
    fontSize: 9.5,
    color: "#444",
    marginTop: 20, // Reduced from 20 to keep it attached to the name
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  contactItem: {
    fontSize: 9.5,
    color: "#444",
  },
  contactSeparator: {
    fontSize: 9.5,
    color: "#999",
    marginHorizontal: 6,
  },
  contactLink: {
    fontSize: 9.5,
    color: "#0077b5",
    textDecoration: "none",
  },

  /* ── Section ── */
  section: {
    marginBottom: 12, // Consolidated spacing to the bottom only
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 6, // Controls space between title and first item
  },

  /* ── Summary ── */
  summaryText: {
    fontSize: 10,
    color: "#333",
    lineHeight: 1.6,
  },

  /* ── Experience / Projects ── */
  itemBlock: {
    marginBottom: 8, // Space between individual jobs/projects
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Changed from baseline to prevent weird shifts
    marginBottom: 2,
  },
  itemTitleRow: {
    flex: 1, // Allows the text to take up available space and wrap correctly
    paddingRight: 10, // Prevents text from colliding with the date
  },
  itemRole: {
    fontSize: 10.5,
    fontWeight: 700,
  },
  itemCompany: {
    fontSize: 10.5,
    color: "#555",
  },
  itemDuration: {
    fontSize: 9.5,
    color: "#555",
    flexShrink: 0, // Prevents the date from wrapping oddly
    marginTop: 1, // Micro-adjustment to align with the bolded text
  },
  itemDescription: {
    fontSize: 10,
    color: "#444",
    lineHeight: 1.5,
    marginBottom: 2,
  },
  projLink: {
    fontSize: 9.5,
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
  },

  /* ── Bullets ── */
  bulletList: {
    marginTop: 2,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start", // Ensures long bullets don't center the dot
    marginBottom: 3,
  },
  bulletDot: {
    fontSize: 10,
    marginRight: 6,
    color: "#333",
    marginTop: -1, // Adjusts bullet dot to visually center with the first line of text
  },
  bulletText: {
    fontSize: 9.5,
    color: "#222",
    lineHeight: 1.5,
    flex: 1,
  },

  /* ── Skills & Languages ── */
  skillsText: {
    fontSize: 10,
    color: "#222",
    lineHeight: 1.6,
  },
  languagesText: {
    fontSize: 10,
    color: "#222",
    lineHeight: 1.6,
  },

  /* ── Education & Certifications ── */
  eduMeta: {
    fontSize: 9.5,
    color: "#555",
    marginTop: 1,
  },
  certLink: {
    fontSize: 9.5,
    color: "#0077b5",
    textDecoration: "none",
  },
});

/* ────────────────────────────────────────────────
 * Helper components
 * ──────────────────────────────────────────────── */

function BulletList({ items }: { items: string[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <View style={styles.bulletList}>
      {items.map((bullet, i) => (
        <View key={i} style={styles.bulletItem}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
    </View>
  );
}

function ContactSeparator() {
  return <Text style={styles.contactSeparator}>|</Text>;
}

/* ────────────────────────────────────────────────
 * Main Document
 * ──────────────────────────────────────────────── */

export function ModernTemplate({ content }: ResumeDocumentProps) {
  const {
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
  } = content as Partial<ResumeContent>;

  const safeSkills: string[] = Array.isArray(skills) ? skills : [];
  const safeExperience: any[] = Array.isArray(experience) ? experience : [];
  const safeProjects: any[] = Array.isArray(projects) ? projects : [];
  const safeEducation: any[] = Array.isArray(education) ? education : [];
  const safeCertifications: any[] = Array.isArray(certifications)
    ? certifications
    : [];
  const safeLanguages: any[] = Array.isArray(languages) ? languages : [];

  // Build contact parts
  const contactItems: React.ReactNode[] = [];
  if (personalInfo.email) {
    contactItems.push(
      <Text key="email" style={styles.contactItem}>
        {personalInfo.email}
      </Text>
    );
  }
  if (personalInfo.phone) {
    contactItems.push(
      <Text key="phone" style={styles.contactItem}>
        {personalInfo.phone}
      </Text>
    );
  }
  if (personalInfo.location) {
    contactItems.push(
      <Text key="location" style={styles.contactItem}>
        {personalInfo.location}
      </Text>
    );
  }
  if (personalInfo.linkedin) {
    contactItems.push(
      <Link
        key="linkedin"
        src={personalInfo.linkedin}
        style={styles.contactLink}
      >
        LinkedIn
      </Link>
    );
  }
  if (personalInfo.portfolio) {
    contactItems.push(
      <Link
        key="portfolio"
        src={personalInfo.portfolio}
        style={styles.contactLink}
      >
        Portfolio
      </Link>
    );
  }

  // Interleave separators
  const contactLine: React.ReactNode[] = [];
  contactItems.forEach((item, i) => {
    contactLine.push(item);
    if (i < contactItems.length - 1) {
      contactLine.push(<ContactSeparator key={`sep-${i}`} />);
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name ?? ""}</Text>
          {contactLine.length > 0 && (
            <View style={styles.contact}>{contactLine}</View>
          )}
        </View>

        {/* ── SUMMARY ── */}
        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {/* ── EXPERIENCE ── */}
        {safeExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {safeExperience.map((exp, i) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitleRow}>
                    <Text style={styles.itemRole}>{exp.role ?? ""}</Text>
                    {exp.company && (
                      <Text style={styles.itemCompany}>
                        {"  —  "}
                        {exp.company}
                      </Text>
                    )}
                  </Text>
                  <Text style={styles.itemDuration}>{exp.duration ?? ""}</Text>
                </View>
                <BulletList items={exp.bullets} />
              </View>
            ))}
          </View>
        )}

        {/* ── PROJECTS ── */}
        {safeProjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {safeProjects.map((proj, i) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitleRow}>
                    <Text style={styles.itemRole}>{proj.title ?? ""}</Text>
                    {proj.link && (
                      <Text>
                        {"  —  "}
                        <Link src={proj.link} style={styles.projLink}>
                          {proj.link}
                        </Link>
                      </Text>
                    )}
                  </Text>
                </View>
                {proj.description && (
                  <Text style={styles.itemDescription}>{proj.description}</Text>
                )}
                <BulletList items={proj.bullets} />
              </View>
            ))}
          </View>
        )}

        {/* ── SKILLS ── */}
        {safeSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>{safeSkills.join("  •  ")}</Text>
          </View>
        )}

        {/* ── EDUCATION ── */}
        {safeEducation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {safeEducation.map((edu, i) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitleRow}>
                    <Text style={styles.itemRole}>
                      {edu.degree ?? ""}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </Text>
                    {edu.school && (
                      <Text style={styles.itemCompany}>
                        {"  —  "}
                        {edu.school}
                      </Text>
                    )}
                  </Text>
                  <Text style={styles.itemDuration}>{edu.year ?? ""}</Text>
                </View>
                {edu.gpa && <Text style={styles.eduMeta}>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* ── CERTIFICATIONS ── */}
        {safeCertifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {safeCertifications.map((cert, i) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitleRow}>
                    <Text style={styles.itemRole}>{cert.name ?? ""}</Text>
                    {cert.issuer && (
                      <Text style={styles.itemCompany}>
                        {"  —  "}
                        {cert.issuer}
                      </Text>
                    )}
                    {cert.url && (
                      <Text>
                        {"  "}
                        <Link src={cert.url} style={styles.certLink}>
                          [Verify]
                        </Link>
                      </Text>
                    )}
                  </Text>
                  <Text style={styles.itemDuration}>{cert.date ?? ""}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── LANGUAGES ── */}
        {safeLanguages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.languagesText}>
              {safeLanguages
                .map(
                  (lang) =>
                    `${lang.language ?? ""} ${lang.proficiency ? `(${lang.proficiency})` : ""}`
                )
                .join("  •  ")}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}