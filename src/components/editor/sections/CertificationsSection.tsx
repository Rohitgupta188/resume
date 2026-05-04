"use client";

import { useEditor } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Award } from "lucide-react";
import { Reorder } from "framer-motion";

export function CertificationsSection() {
  const { resume, setResume } = useEditor();
  const certifications = resume?.content?.certifications || [];

  const updateCertifications = (newList: any[]) => {
    setResume({ ...resume.content, certifications: newList });
  };

  const addCertification = () => {
    updateCertifications([...certifications, { name: "", issuer: "", date: "", url: "" }]);
  };

  const removeCertification = (index: number) => {
    updateCertifications(certifications.filter((_: any, i: number) => i !== index));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newList = [...certifications];
    newList[index] = { ...newList[index], [field]: value };
    updateCertifications(newList);
  };

  return (
    <div className="space-y-6">
      <Reorder.Group axis="y" values={certifications} onReorder={updateCertifications} className="space-y-4">
        {certifications.map((cert: any, index: number) => (
          <Reorder.Item key={index} value={cert} className="border rounded-xl bg-background/50 p-4 space-y-4 shadow-sm relative group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                <span className="text-xs font-bold uppercase text-muted-foreground text-primary/80">Certification #{index + 1}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => removeCertification(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-full">
                <Label className="text-xs">Certification Name</Label>
                <Input placeholder="e.g. AWS Certified Solutions Architect" value={cert.name || ""} onChange={(e) => handleChange(index, "name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Issuer</Label>
                <Input placeholder="e.g. Amazon Web Services" value={cert.issuer || ""} onChange={(e) => handleChange(index, "issuer", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Date Received</Label>
                <Input placeholder="e.g. June 2023" value={cert.date || ""} onChange={(e) => handleChange(index, "date", e.target.value)} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label className="text-xs">Credential URL</Label>
                <Input placeholder="e.g. https://aws.amazon.com/verify/..." value={cert.url || ""} onChange={(e) => handleChange(index, "url", e.target.value)} />
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button variant="outline" onClick={addCertification} className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5 gap-2 font-bold uppercase tracking-wider text-xs">
        <Plus className="h-4 w-4" /> Add Certification
      </Button>
    </div>
  );
}
