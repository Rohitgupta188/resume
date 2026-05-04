import { ModernTemplate } from "./modern";
import { ProfessionalTemplate } from "./professional";
import { MinimalistTemplate } from "./minimalist";
import { CreativeTemplate } from "./creative";
import { ExecutiveTemplate } from "./executive";
import { TechTemplate } from "./tech";

export const RESUME_TEMPLATES = {
  modern: {
    id: "modern",
    name: "Modern Design",
    component: ModernTemplate,
    thumbnail: "/templates/modern.png"
  },
  professional: {
    id: "professional",
    name: "Professional Classic",
    component: ProfessionalTemplate,
    thumbnail: "/templates/professional.png"
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalist Clean",
    component: MinimalistTemplate,
    thumbnail: "/templates/minimalist.png"
  },
  creative: {
    id: "creative",
    name: "Creative Edge",
    component: CreativeTemplate,
    thumbnail: "/templates/creative.png"
  },
  executive: {
    id: "executive",
    name: "Executive Elite",
    component: ExecutiveTemplate,
    thumbnail: "/templates/executive.png"
  },
  tech: {
    id: "tech",
    name: "Tech Developer",
    component: TechTemplate,
    thumbnail: "/templates/tech.png"
  }
} as const;

export type TemplateId = keyof typeof RESUME_TEMPLATES;
