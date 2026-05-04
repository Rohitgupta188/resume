"use client";

import React, { useId } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";

export function EducationSection() {
  const { resume, setResume } = useEditor();
  const education = resume?.content?.education || [];
  const baseId = useId();

  const updateEducation = (newList: any[]) => {
    setResume({ ...resume.content, education: newList });
  };

  const addEducation = () => {
    updateEducation([...education, { school: "", degree: "", year: "" }]);
  };

  const removeEducation = (index: number) => {
    updateEducation(education.filter((_: any, i: number) => i !== index));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newList = [...education];
    newList[index] = { ...newList[index], [field]: value };
    updateEducation(newList);
  };

  return (
    <div className="space-y-6">
      <Reorder.Group axis="y" values={education} onReorder={updateEducation} className="space-y-4">
        {education.map((edu: any, index: number) => (
          <Reorder.Item key={index} value={edu} className="border rounded-xl bg-background/50 p-4 space-y-4 shadow-sm relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Education #{index + 1}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => removeEducation(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-full">
                <Label htmlFor={`${baseId}-school-${index}`} className="text-xs">School / University</Label>
                <Input id={`${baseId}-school-${index}`} placeholder="e.g. Stanford University" value={edu.school || ""} onChange={(e) => handleChange(index, "school", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${baseId}-degree-${index}`} className="text-xs">Degree / Qualification</Label>
                <Input id={`${baseId}-degree-${index}`} placeholder="e.g. Bachelor of Science" value={edu.degree || ""} onChange={(e) => handleChange(index, "degree", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${baseId}-year-${index}`} className="text-xs">Graduation Year / Period</Label>
                <Input id={`${baseId}-year-${index}`} placeholder="e.g. 2018 - 2022" value={edu.year || ""} onChange={(e) => handleChange(index, "year", e.target.value)} />
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button variant="outline" onClick={addEducation} className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5 gap-2">
        <Plus className="h-4 w-4" /> Add Education
      </Button>
    </div>
  );
}
