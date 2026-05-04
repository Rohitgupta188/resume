"use client";

import { useEditor } from "@/contexts/EditorContext";
import { useResumeDetail } from "@/hooks/useResume";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  ChevronLeft, 
  Sparkles, 
  Check, 
  CloudIcon, 
  LayoutGrid,
  Briefcase,
  BarChart3
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { RESUME_TEMPLATES } from "@/lib/pdf/templates";
import { toast } from "sonner";

import { EnhanceModal } from "./EnhanceModal";
import { useState } from "react";
import Link from "next/link";

export function EditorToolbar() {
  const { 
    resume, 
    templateId, 
    setTemplateId, 
    isSaving, 
    activateResume,
    applyAIEnhancement
  } = useEditor();

  const { downloadPDF, enhanceResume } = useResumeDetail();
  
  const [enhanceData, setEnhanceData] = useState<any>(null);
  const [isEnhanceOpen, setIsEnhanceOpen] = useState(false);

  const handleDownload = () => {
    if (resume) {
      downloadPDF(resume._id, resume.title, templateId);
    }
  };

  const handleActivate = async () => {
     if (resume) {
        await activateResume();
     }
  };

  const handleEnhance = async () => {
     if (resume) {
        if (!resume.isActive) {
           toast.error("Please set this resume as 'Active' first to use AI Enhance features.");
           return;
        }
        try {
           const data = await enhanceResume(resume._id);
           setEnhanceData(data);
           setIsEnhanceOpen(true);
        } catch (err) {
           console.error(err);
        }
     }
  };

// Inside EditorToolbar component...

const handleAcceptEnhance = async (data: { 
  improvedContent: any; 
  atsScore: number; 
  contentHash: string 
}) => {
  if (!enhanceData) return;

  try {
    // PASS ALL THREE: content, score, AND the hash
    await applyAIEnhancement(
      data.improvedContent,
      data.atsScore,
      data.contentHash 
    );

    setIsEnhanceOpen(false);
    setEnhanceData(null);
  } catch (err) {
    console.error("Failed to apply enhancement:", err);
    // Note: toast is usually handled inside your applyAIEnhancement hook
  }
};

  const handleDiscardEnhance = () => {
     setIsEnhanceOpen(false);
     setEnhanceData(null);
     toast.info("AI suggestions discarded");
  };

  return (
    <div className="h-14 border-b bg-card flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
        <h1 className="font-bold text-sm truncate max-w-[140px] sm:max-w-[240px]">
          {resume?.title || "Untitled Resume"}
        </h1>
        {resume?.atsScore && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold bg-primary/5 border-primary/20 text-primary shrink-0">
            <BarChart3 className="h-3 w-3" />
            ATS {resume.atsScore}%
          </div>
        )}
        <div className="flex items-center gap-1.5 ml-1 text-muted-foreground">
           {isSaving ? (
              <div className="flex items-center gap-1.5">
                 <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                 <span className="text-[10px] font-medium uppercase tracking-wider hidden sm:inline">Saving...</span>
              </div>
           ) : (
              <div className="flex items-center gap-1.5">
                 <Check className="h-3 w-3 text-green-500" />
                 <span className="text-[10px] font-medium uppercase tracking-wider hidden sm:inline">Saved</span>
              </div>
           )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Job Match shortcut */}
        <Link href="/jobs" className="hidden lg:flex">
          <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground hover:text-foreground">
            <Briefcase className="h-4 w-4" />
            <span>Job Match</span>
          </Button>
        </Link>
        <div className="h-6 w-px bg-border hidden lg:block" />
        {/* Template Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 hidden lg:flex">
              <LayoutGrid className="h-4 w-4" />
              <span>Template: {RESUME_TEMPLATES[templateId as keyof typeof RESUME_TEMPLATES]?.name || "Modern"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 bg-slate-900 text-slate-100 border-slate-800 shadow-xl">
            <DropdownMenuLabel className="text-slate-400 font-bold uppercase text-[10px] tracking-widest px-2 py-1.5">Choose Template</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            {Object.entries(RESUME_TEMPLATES).map(([id, config]) => (
              <DropdownMenuItem 
                key={id} 
                onClick={() => setTemplateId(id)}
                className={`cursor-pointer transition-colors focus:bg-slate-800 focus:text-white ${templateId === id ? "bg-slate-800 text-primary font-bold" : ""}`}
              >
                {config.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border mx-1 hidden lg:block" />

        {resume?.isActive ? (
          <Badge variant="outline" className="h-9 px-3 gap-1.5 bg-green-500/10 text-green-500 border-green-500/20 font-bold uppercase tracking-wider text-[10px]">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Active
          </Badge>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-2 border-dashed hover:border-primary hover:bg-primary/5 group"
            onClick={handleActivate}
          >
            <CloudIcon className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span className="hidden sm:inline">Set Active</span>
          </Button>
        )}

        <Button 
          variant="secondary" 
          size="sm" 
          className="h-9 gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none"
          onClick={handleEnhance}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">AI Enhance</span>
        </Button>

        <Button 
          size="sm" 
          className="h-9 gap-2 font-bold px-4 shadow-lg shadow-primary/20"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download PDF</span>
        </Button>
      </div>
      <EnhanceModal 
        isOpen={isEnhanceOpen}
        onClose={handleDiscardEnhance}
        originalContent={resume}
        enhancedData={enhanceData}
        onAccept={handleAcceptEnhance}
        onDiscard={handleDiscardEnhance}
      />
    </div>
  );
}
