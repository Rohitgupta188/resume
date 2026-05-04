"use client";

import React, { useState, useId } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { BulletEditor } from "../BulletEditor";

export function ExperienceSection() {
  const { resume, setResume } = useEditor();
  const experience = resume?.content?.experience || [];
  const baseId = useId();

  const updateExperience = (newList: any[]) => {
    setResume({
      ...resume.content,
      experience: newList
    });
  };

  const addExperience = () => {
    updateExperience([
      ...experience,
      { role: "", company: "", duration: "", bullets: [""] }
    ]);
  };

  const removeExperience = (index: number) => {
    updateExperience(experience.filter((_: any, i: number) => i !== index));
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newList = [...experience];
    newList[index] = { ...newList[index], [field]: value };
    updateExperience(newList);
  };

  return (
    <div className="space-y-6">
      <Reorder.Group axis="y" values={experience} onReorder={updateExperience} className="space-y-4">
        {experience.map((exp: any, index: number) => (
          <Reorder.Item 
            key={index} 
            value={exp}
            className="border rounded-xl bg-background/50 p-4 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
               <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Entry #{index + 1}</span>
               </div>
               <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                onClick={() => removeExperience(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${baseId}-role-${index}`} className="text-xs">Role / Title</Label>
                <Input 
                  id={`${baseId}-role-${index}`}
                  placeholder="e.g. Senior Software Engineer" 
                  value={exp.role || ""} 
                  onChange={(e) => handleChange(index, "role", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${baseId}-company-${index}`} className="text-xs">Company / Organization</Label>
                <Input 
                  id={`${baseId}-company-${index}`}
                  placeholder="e.g. Tech Corp" 
                  value={exp.company || ""} 
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor={`${baseId}-duration-${index}`} className="text-xs">Duration / Date Range</Label>
                <Input 
                  id={`${baseId}-duration-${index}`}
                  placeholder="e.g. Jan 2020 - Present" 
                  value={exp.duration || ""} 
                  onChange={(e) => handleChange(index, "duration", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
               <Label className="text-xs font-bold uppercase text-primary tracking-wider">Achievements & Responsibilities</Label>
               <BulletEditor 
                  bullets={exp.bullets || []} 
                  onChange={(newBullets) => handleChange(index, "bullets", newBullets)} 
               />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Button 
        variant="outline" 
        onClick={addExperience} 
        className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5 gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Work Experience
      </Button>
    </div>
  );
}
