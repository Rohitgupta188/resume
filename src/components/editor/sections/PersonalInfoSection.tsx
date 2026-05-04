"use client";

import React, { useId } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PersonalInfoSection() {
  const { resume, setResume } = useEditor();
  const info = resume?.content?.personalInfo || {};
  
  const baseId = useId();

  const handleChange = (field: string, value: string) => {
    setResume({
      ...resume.content,
      personalInfo: {
        ...info,
        [field]: value
      }
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2 col-span-full">
        <Label htmlFor={baseId + "-name"}>Full Name</Label>
        <Input 
          id={baseId + "-name"} 
          placeholder="John Doe" 
          autoComplete="name"
          value={info.name || ""} 
          onChange={(e) => handleChange("name", e.target.value)} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={baseId + "-email"}>Email</Label>
        <Input 
          id={baseId + "-email"} 
          type="email" 
          placeholder="john@example.com" 
          autoComplete="email"
          value={info.email || ""} 
          onChange={(e) => handleChange("email", e.target.value)} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={baseId + "-phone"}>Phone</Label>
        <Input 
          id={baseId + "-phone"} 
          placeholder="+1 (555) 000-0000" 
          autoComplete="tel"
          value={info.phone || ""} 
          onChange={(e) => handleChange("phone", e.target.value)} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={baseId + "-location"}>Location</Label>
        <Input 
          id={baseId + "-location"} 
          placeholder="City, State" 
          autoComplete="address-level2"
          value={info.location || ""} 
          onChange={(e) => handleChange("location", e.target.value)} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={baseId + "-linkedin"}>LinkedIn URL</Label>
        <Input 
          id={baseId + "-linkedin"} 
          placeholder="linkedin.com/in/johndoe" 
          autoComplete="url"
          value={info.linkedin || ""} 
          onChange={(e) => handleChange("linkedin", e.target.value)} 
        />
      </div>
      
      <div className="space-y-2 col-span-full">
        <Label htmlFor={baseId + "-portfolio"}>Portfolio / Website URL</Label>
        <Input 
          id={baseId + "-portfolio"} 
          placeholder="johndoe.com" 
          autoComplete="url"
          value={info.portfolio || ""} 
          onChange={(e) => handleChange("portfolio", e.target.value)} 
        />
      </div>
    </div>
  );
}
