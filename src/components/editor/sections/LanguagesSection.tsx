"use client";

import { useEditor } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Globe } from "lucide-react";
import { Reorder } from "framer-motion";

export function LanguagesSection() {
  const { resume, setResume } = useEditor();
  const languages = resume?.content?.languages || [];

  const updateLanguages = (newList: any[]) => {
    setResume({ ...resume.content, languages: newList });
  };

  const addLanguage = () => {
    updateLanguages([...languages, { language: "", proficiency: "" }]);
  };

  const removeLanguage = (index: number) => {
    updateLanguages(languages.filter((_: any, i: number) => i !== index));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newList = [...languages];
    newList[index] = { ...newList[index], [field]: value };
    updateLanguages(newList);
  };

  return (
    <div className="space-y-6">
      <Reorder.Group axis="y" values={languages} onReorder={updateLanguages} className="space-y-4">
        {languages.map((lang: any, index: number) => (
          <Reorder.Item key={index} value={lang} className="border rounded-xl bg-background/50 p-4 space-y-4 shadow-sm relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                <span className="text-xs font-bold uppercase text-muted-foreground text-primary/80">Language #{index + 1}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => removeLanguage(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Language</Label>
                <Input placeholder="e.g. English, French, Spanish" value={lang.language || ""} onChange={(e) => handleChange(index, "language", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Proficiency</Label>
                <Input placeholder="e.g. Native, Fluent, Professional" value={lang.proficiency || ""} onChange={(e) => handleChange(index, "proficiency", e.target.value)} />
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button variant="outline" onClick={addLanguage} className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5 gap-2 font-bold uppercase tracking-wider text-xs">
        <Plus className="h-4 w-4" /> Add Language
      </Button>
    </div>
  );
}
