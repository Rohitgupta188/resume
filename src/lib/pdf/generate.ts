import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
// This import looks for src/lib/pdf/templates/index.ts
import { TemplateId, RESUME_TEMPLATES } from "./templates";
import { ResumeContent, ResumeDocumentProps } from "./types";

export async function generateResumePDF(
  content: ResumeContent, 
  templateId: TemplateId = "modern"
): Promise<Uint8Array> {
  // 1. Select the template component from our registry
  const templateConfig = RESUME_TEMPLATES[templateId] || RESUME_TEMPLATES.modern;
  const Template = templateConfig.component as React.ComponentType<ResumeDocumentProps>;
  
  // 2. Create the element
  const element = React.createElement(Template, { content }) as
    React.ReactElement<DocumentProps>;
    
  // 3. Render to PDF buffer
  const buffer = await renderToBuffer(element);
  return new Uint8Array(buffer);
}
