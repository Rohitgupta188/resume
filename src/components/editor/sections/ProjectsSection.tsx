"use client";

import React, { useId } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Link as LinkIcon } from "lucide-react";
import { Reorder } from "framer-motion";
import { BulletEditor } from "../BulletEditor";

export function ProjectsSection() {
  const { resume, setResume } = useEditor();
  const projects = resume?.content?.projects || [];
  const baseId = useId();

  const updateProjects = (newList: any[]) => {
    setResume({ ...resume.content, projects: newList });
  };

  const addProject = () => {
    updateProjects([...projects, { title: "", link: "", description: "", bullets: [""] }]);
  };

  const removeProject = (index: number) => {
    updateProjects(projects.filter((_: any, i: number) => i !== index));
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newList = [...projects];
    newList[index] = { ...newList[index], [field]: value };
    updateProjects(newList);
  };

  return (
    <div className="space-y-6">
      <Reorder.Group axis="y" values={projects} onReorder={updateProjects} className="space-y-4">
        {projects.map((proj: any, index: number) => (
          <Reorder.Item key={index} value={proj} className="border rounded-xl bg-background/50 p-4 space-y-4 shadow-sm relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                <span className="text-xs font-bold uppercase text-muted-foreground">Project #{index + 1}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => removeProject(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${baseId}-title-${index}`} className="text-xs">Project Title</Label>
                <Input 
                  id={`${baseId}-title-${index}`}
                  placeholder="e.g. E-commerce Platform" 
                  value={proj.title || ""} 
                  onChange={(e) => handleChange(index, "title", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${baseId}-link-${index}`} className="text-xs flex items-center gap-1.5">
                   <LinkIcon className="h-3 w-3" /> Project Link / URL
                </Label>
                <Input 
                  id={`${baseId}-link-${index}`}
                  placeholder="e.g. github.com/username/project" 
                  value={proj.link || ""} 
                  onChange={(e) => handleChange(index, "link", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${baseId}-desc-${index}`} className="text-xs">Short Description</Label>
                <Input 
                  id={`${baseId}-desc-${index}`}
                  placeholder="e.g. A full-stack application built with..." 
                  value={proj.description || ""} 
                  onChange={(e) => handleChange(index, "description", e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-3">
               <Label className="text-xs font-bold uppercase text-primary tracking-wider">Key Features & Impact</Label>
               <BulletEditor 
                  bullets={proj.bullets || []} 
                  onChange={(newBullets) => handleChange(index, "bullets", newBullets)} 
               />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button variant="outline" onClick={addProject} className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5 gap-2">
        <Plus className="h-4 w-4" /> Add Project
      </Button>
    </div>
  );
}
