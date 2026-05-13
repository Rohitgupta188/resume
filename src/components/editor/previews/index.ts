export { ModernPreview } from "./ModernPreview";
export { ProfessionalPreview } from "./ProfessionalPreview";
export { MinimalistPreview } from "./MinimalistPreview";
export { ExecutivePreview } from "./ExecutivePreview";
export { TechPreview } from "./TechPreview";
export { CreativePreview } from "./CreativePreview";

import { ModernPreview } from "./ModernPreview";
import { ProfessionalPreview } from "./ProfessionalPreview";
import { MinimalistPreview } from "./MinimalistPreview";
import { ExecutivePreview } from "./ExecutivePreview";
import { TechPreview } from "./TechPreview";
import { CreativePreview } from "./CreativePreview";
import type { ComponentType } from "react";

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE REGISTRY — Single source of truth for all templates.
   HTML previews ARE the PDF (via window.print() pdf-service).
   ═══════════════════════════════════════════════════════════════ */

export interface TemplateConfig {
  id: string;
  name: string;
  component: ComponentType<{ content: any; isPrint?: boolean }>;
}

export const RESUME_TEMPLATES: Record<string, TemplateConfig> = {
  modern: {
    id: "modern",
    name: "Modern Design",
    component: ModernPreview,
  },
  professional: {
    id: "professional",
    name: "Professional Classic",
    component: ProfessionalPreview,
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalist Clean",
    component: MinimalistPreview,
  },
  creative: {
    id: "creative",
    name: "Creative Edge",
    component: CreativePreview,
  },
  executive: {
    id: "executive",
    name: "Executive Elite",
    component: ExecutivePreview,
  },
  tech: {
    id: "tech",
    name: "Tech Developer",
    component: TechPreview,
  },
} as const;

export type TemplateId = keyof typeof RESUME_TEMPLATES;
