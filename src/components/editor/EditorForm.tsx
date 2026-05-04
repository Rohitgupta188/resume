"use client";

import { useEditor } from "@/contexts/EditorContext";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Wrench, 
  Globe, 
  Trophy 
} from "lucide-react";

// Section Components (To be created)
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { SummarySection } from "./sections/SummarySection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { LanguagesSection } from "./sections/LanguagesSection";

const SECTIONS = [
  { id: "personalInfo", label: "Personal Information", icon: <User className="h-4 w-4" />, component: PersonalInfoSection },
  { id: "summary", label: "Professional Summary", icon: <FileText className="h-4 w-4" />, component: SummarySection },
  { id: "experience", label: "Work Experience", icon: <Briefcase className="h-4 w-4" />, component: ExperienceSection },
  { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" />, component: EducationSection },
  { id: "projects", label: "Projects", icon: <Wrench className="h-4 w-4" />, component: ProjectsSection },
  { id: "skills", label: "Skills", icon: <Award className="h-4 w-4" />, component: SkillsSection },
  { id: "certifications", label: "Certifications", icon: <Trophy className="h-4 w-4" />, component: CertificationsSection },
  { id: "languages", label: "Languages", icon: <Globe className="h-4 w-4" />, component: LanguagesSection },
];

export function EditorForm() {
  const { activeSection, setActiveSection } = useEditor();

  return (
    <div className="space-y-6 pb-20">
      <Accordion 
        type="single" 
        collapsible 
        value={activeSection} 
        onValueChange={setActiveSection}
        className="space-y-4"
      >
        {SECTIONS.map((section) => (
          <AccordionItem 
            key={section.id} 
            value={section.id} 
            className="border rounded-xl bg-card overflow-hidden shadow-sm px-4"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {section.icon}
                </div>
                <span className="font-bold text-sm">{section.label}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <section.component />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
