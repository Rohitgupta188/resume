"use client";

import { useState } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SkillsSection() {
  const { resume, setResume } = useEditor();
  const skills = resume?.content?.skills || [];
  const [newSkill, setNewSkill] = useState("");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setResume({ ...resume.content, skills: [...skills, trimmed] });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResume({
      ...resume.content,
      skills: skills.filter((s: string) => s !== skillToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input 
          placeholder="e.g. React, TypeScript, Leadership..." 
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(newSkill))}
          className="h-10 rounded-xl"
        />
        <Button onClick={() => addSkill(newSkill)} size="icon" className="h-10 w-10 shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[40px] p-4 rounded-xl border bg-accent/5 border-dashed">
        {skills.length === 0 ? (
          <p className="text-xs text-muted-foreground w-full text-center py-2 italic">
            No skills added yet. Type a skill and press Enter.
          </p>
        ) : (
          skills.map((skill: string, index: number) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="py-1.5 pl-3 pr-1 text-sm rounded-lg flex items-center gap-1 group bg-card border hover:bg-accent transition-colors max-w-full"
            >
              <span className="truncate ">{skill}</span>
              <button 
                onClick={() => removeSkill(skill)}
                className="h-5 w-5 shrink-0 rounded-md flex items-center justify-center hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

    </div>
  );
}
