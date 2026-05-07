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
  Trophy,
  LayoutList,
  ChevronUp,
  ChevronDown
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
import { CustomSectionsSection } from "./sections/CustomSectionsSection";

const SECTIONS = [
  { id: "personalInfo",    label: "Personal Information",  icon: <User className="h-4 w-4" />,         component: PersonalInfoSection },
  { id: "summary",        label: "Professional Summary",  icon: <FileText className="h-4 w-4" />,     component: SummarySection },
  { id: "experience",     label: "Work Experience",        icon: <Briefcase className="h-4 w-4" />,    component: ExperienceSection },
  { id: "education",      label: "Education",              icon: <GraduationCap className="h-4 w-4" />, component: EducationSection },
  { id: "projects",       label: "Projects",               icon: <Wrench className="h-4 w-4" />,       component: ProjectsSection },
  { id: "skills",         label: "Skills",                 icon: <Award className="h-4 w-4" />,        component: SkillsSection },
  { id: "certifications", label: "Certifications",         icon: <Trophy className="h-4 w-4" />,       component: CertificationsSection },
  { id: "languages",      label: "Languages",              icon: <Globe className="h-4 w-4" />,        component: LanguagesSection },
  { id: "customSections", label: "Custom Sections",        icon: <LayoutList className="h-4 w-4" />,   component: CustomSectionsSection },
];

export function EditorForm() {
  const { activeSection, setActiveSection, resume, moveSection } = useEditor();

  const order = resume?.content?.sectionOrder || [
    "summary", "experience", "education", "projects", "skills", "certifications", "languages", "customSections"
  ];

  // Always put personalInfo first, then the rest in user-defined order
  const sortedSections = [
    SECTIONS.find(s => s.id === "personalInfo")!,
    ...order.map((id: string) => SECTIONS.find(s => s.id === id)).filter(Boolean) as typeof SECTIONS
  ];

  return (
    <div className="space-y-6 pb-20">
      <Accordion 
        type="single" 
        collapsible 
        value={activeSection} 
        onValueChange={setActiveSection}
        className="space-y-4"
      >
        {sortedSections.map((section) => (
          <AccordionItem 
            key={section.id} 
            value={section.id} 
            className="border rounded-xl bg-card overflow-hidden shadow-sm px-4"
          >
            <div className="flex items-center gap-2 group">
              {/* Reorder Controls */}
              {section.id !== "personalInfo" && (
                <div className="flex flex-col gap-0.5 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-all -ml-2 pr-1 border-r border-border/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(section.id, "up");
                    }}
                    className="p-1 hover:bg-primary/10 rounded-sm text-muted-foreground hover:text-primary transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(section.id, "down");
                    }}
                    className="p-1 hover:bg-primary/10 rounded-sm text-muted-foreground hover:text-primary transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              )}

              <AccordionTrigger className="hover:no-underline py-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  <span className="font-bold text-sm">{section.label}</span>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="pb-6 pt-2">
              <section.component />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
