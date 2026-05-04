import { DocumentProps } from "@react-pdf/renderer";

export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  location?: string;
  portfolio?: string;
}

export interface EducationEntry {
  school?: string;
  degree?: string;
  field?: string;
  year?: string;
  gpa?: string;
}

export interface ExperienceEntry {
  company?: string;
  role?: string;
  duration?: string;
  bullets?: string[];
}

export interface ProjectEntry {
  title?: string;
  description?: string;
  techStack?: string[] | string;
  link?: string;
  bullets?: string[];
}

export interface CertificationEntry {
  name?: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export interface LanguageEntry {
  language?: string;
  proficiency?: string;
}

export interface ResumeContent {
  personalInfo?: PersonalInfo;
  summary?: string;
  education?: EducationEntry[];
  skills?: string[];
  experience?: ExperienceEntry[];
  projects?: ProjectEntry[];
  certifications?: CertificationEntry[];
  languages?: LanguageEntry[];
  hobbies?: string[];
  certificates?: string[]; // Used in some templates
  interests?: string[];    // Used in some templates
}

export interface ResumeDocumentProps extends DocumentProps {
  content: ResumeContent;
}
