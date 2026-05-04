"use client";

import { useEditor } from "@/contexts/EditorContext";
import { 
  ModernPreview, 
  ProfessionalPreview, 
  MinimalistPreview, 
  ExecutivePreview,
  TechPreview,
  CreativePreview
} from "./previews";

/* ═══════════════════════════════════════════════
   RESUME PREVIEW — HTML Mirror of PDF
   ═══════════════════════════════════════════════ */

export function ResumePreview() {
  const { resume, templateId } = useEditor();

  if (!resume) return null;

  const content = resume.content;

  const renderTemplate = () => {
    switch (templateId) {
      case "professional":
        return <ProfessionalPreview content={content} />;
      case "minimalist":
        return <MinimalistPreview content={content} />;
      case "executive":
        return <ExecutivePreview content={content} />;
      case "tech":
        return <TechPreview content={content} />;
      case "creative":
        return <CreativePreview content={content} />;
      case "modern":
      default:
        return <ModernPreview content={content} />;
    }
  };

  return (
    <div 
      className="bg-white text-black shadow-2xl mx-auto overflow-hidden"
      style={{
        aspectRatio: "1 / 1.414", // A4 Ratio
        width: "100%",
        minHeight: "100%",
      }}
    >
      {renderTemplate()}
    </div>
  );
}
