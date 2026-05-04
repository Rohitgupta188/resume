"use client";

import React, { useId } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SummarySection() {
  const { resume, setResume } = useEditor();
  const summary = resume?.content?.summary || "";
  const summaryId = useId();

  const handleChange = (value: string) => {
    setResume({
      ...resume.content,
      summary: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={summaryId}>Professional Summary</Label>
        <Textarea 
          id={summaryId} 
          placeholder="Experienced Software Engineer with a focus on..." 
          className="min-h-[150px] leading-relaxed resize-none"
          value={summary}
          onChange={(e) => handleChange(e.target.value)}
        />
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
           Pro tip: Keep it between 3-5 sentences and highlight your biggest achievements.
        </p>
      </div>
    </div>
  );
}
