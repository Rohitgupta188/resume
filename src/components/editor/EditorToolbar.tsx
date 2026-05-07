"use client";

import { useEditor } from "@/contexts/EditorContext";
import { useResumeDetail, ResumeVersionItem } from "@/hooks/useResume";
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
  BarChart3,
  History,
  Palette,
  Type,
  Monitor,
  Smartphone,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RESUME_TEMPLATES } from "./previews";
import { toast } from "sonner";
import { EnhanceModal } from "./EnhanceModal";
import { VersionHistoryModal } from "./VersionHistoryModal";
import { useState } from "react";
import Link from "next/link";
import { printResume } from "@/lib/pdf-service";

/* ═══════════════════════════════════════════════
   EDITOR TOOLBAR
   ═══════════════════════════════════════════════ */

export function EditorToolbar() {
  const {
    resume,
    setResume,
    templateId,
    setTemplateId,
    isSaving,
    hasChanges,
    saveResume,
    activateResume,
    applyAIEnhancement,
    previewMode,
    setPreviewMode,
  } = useEditor();

  const { enhanceResume, fetchVersions, restoreVersion } = useResumeDetail();

  const [enhanceData, setEnhanceData] = useState<any>(null);
  const [isEnhanceOpen, setIsEnhanceOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [versions, setVersions] = useState<ResumeVersionItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const handleDownload = () => {
    printResume({
      title: resume?.title ?? "resume",
      onBefore: () => toast.info("Opening PDF export…"),
    });
  };

  const handleActivate = async () => {
    if (resume) await activateResume();
  };

  const handleEnhance = async () => {
    if (resume) {
      if (!resume.isActive) {
        toast.error(
          "Please set this resume as 'Active' first to use AI Enhance features."
        );
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

  const handleAcceptEnhance = async (data: {
    improvedContent: any;
    atsScore: number;
    contentHash: string;
  }) => {
    if (!enhanceData) return;
    try {
      await applyAIEnhancement(
        data.improvedContent,
        data.atsScore,
        data.contentHash
      );
      setIsEnhanceOpen(false);
      setEnhanceData(null);
    } catch (err) {
      console.error("Failed to apply enhancement:", err);
    }
  };

  const handleDiscardEnhance = () => {
    setIsEnhanceOpen(false);
    setEnhanceData(null);
    toast.info("AI suggestions discarded");
  };

  const handleOpenHistory = async () => {
    if (!resume) return;
    setIsHistoryOpen(true);
    setIsLoadingHistory(true);
    try {
      const data = await fetchVersions(resume._id);
      setVersions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!resume) return;
    try {
      await restoreVersion(resume._id, versionId);
      setIsHistoryOpen(false);
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

  /* ─────────────────────────────────────────────
     HELPER COMPONENTS
     ───────────────────────────────────────────── */
  
  const ColorPicker = ({ showLabel = false }: { showLabel?: boolean }) => {
    const { themeColor, setThemeColor } = useEditor();

    const colorGroups = [
      { label: "Professional", colors: ["#1f2937", "#374151", "#1e3a5f", "#7c2d3e"] },
      { label: "Cool",         colors: ["#2563eb", "#0891b2", "#059669", "#7c3aed"] },
      { label: "Warm",         colors: ["#dc2626", "#d97706", "#ea580c", "#db2777"] },
      { label: "Modern",       colors: ["#6366f1", "#8b5cf6", "#0d9488", "#4f46e5"] },
    ];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 gap-1.5 ${showLabel ? "px-2.5 w-auto" : "w-8 p-0 xl:w-auto xl:px-2.5"}`}
          >
            <div className="relative">
              <Palette className="h-3.5 w-3.5 text-muted-foreground" />
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background"
                style={{ backgroundColor: themeColor }}
              />
            </div>
            {showLabel ? (
              <span className="text-[10px] font-bold uppercase tracking-tight">Color</span>
            ) : (
              <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-tight">Color</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="p-0 w-[220px] bg-card text-card-foreground border-border shadow-xl">
          {/* Header with live swatch */}
          <div className="px-3 pt-3 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Theme Color</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] text-muted-foreground uppercase">{themeColor}</span>
              <span className="h-4 w-4 rounded-md border border-border shadow-sm" style={{ backgroundColor: themeColor }} />
            </div>
          </div>
          <DropdownMenuSeparator />

          {/* Color groups */}
          <div className="px-3 py-2 space-y-2.5">
            {colorGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">{group.label}</p>
                <div className="flex gap-1.5">
                  {group.colors.map((c) => (
                    <button
                      key={c}
                      className={`h-7 w-7 rounded-lg cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center ${
                        themeColor.toLowerCase() === c.toLowerCase()
                          ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                          : "hover:ring-1 hover:ring-border"
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => setThemeColor(c)}
                      title={c}
                    >
                      {themeColor.toLowerCase() === c.toLowerCase() && (
                        <Check className="h-3 w-3 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <DropdownMenuSeparator />

          {/* Custom picker */}
          <div className="px-3 py-2 flex items-center gap-2">
            <div className="relative h-7 w-7 rounded-lg overflow-hidden border border-dashed border-muted-foreground/30 hover:border-primary bg-slate-950 shrink-0">
              <input
                type="color"
                value={themeColor}
                onInput={(e) => setThemeColor((e.target as HTMLInputElement).value)}
                className="absolute inset-[-5px] w-[150%] h-[150%] cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-muted-foreground">Pick custom color</span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const FontSizePicker = ({ showLabel = false }: { showLabel?: boolean }) => {
    const { fontSize, setFontSize } = useEditor();
    const sizes = [
      { id: "small",  label: "Small",  desc: "Compact & dense",   textClass: "text-[11px]" },
      { id: "normal", label: "Normal", desc: "Balanced (default)", textClass: "text-[13px]" },
      { id: "large",  label: "Large",  desc: "Easy to read",      textClass: "text-[15px]" },
    ];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 gap-1.5 ${showLabel ? "px-2.5 w-auto" : "w-8 p-0 xl:w-auto xl:px-2.5"}`}
          >
            <Type className="h-3.5 w-3.5" />
            {showLabel ? (
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {fontSize === "small" ? "S" : fontSize === "large" ? "L" : "M"}
              </span>
            ) : (
              <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-tight">
                {fontSize === "small" ? "Small" : fontSize === "large" ? "Large" : "Normal"}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[200px] p-0 bg-slate-900 text-slate-100 border-slate-800 shadow-xl">
          <div className="px-3 pt-3 pb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Font Size</span>
          </div>
          <DropdownMenuSeparator className="bg-slate-800" />
          <div className="p-1.5">
            {sizes.map((s) => (
              <button
                key={s.id}
                onClick={() => setFontSize(s.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${
                  fontSize === s.id
                    ? "bg-slate-800 text-primary font-bold"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                {/* Visual Aa indicator */}
                <span className={`${s.textClass} font-bold w-7 text-center shrink-0`}>
                  Aa
                </span>
                <div className="flex-1 text-left min-w-0">
                  <p className={`text-xs font-semibold ${fontSize === s.id ? "text-primary" : ""}`}>{s.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{s.desc}</p>
                </div>
                {fontSize === s.id && (
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const TemplateSelector = ({ showLabel = false }: { showLabel?: boolean }) => {
    const { templateId, setTemplateId } = useEditor();
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`h-8 gap-1.5 ${showLabel ? "px-2.5 w-auto" : "w-8 p-0 xl:w-auto xl:px-2.5"}`}
      >
        <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
        {showLabel ? (
          <span className="text-[10px] font-bold uppercase tracking-tight">Template</span>
        ) : (
          <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-tight text-slate-600">Template</span>
        )}
      </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-slate-900 text-slate-100 border-slate-800 shadow-xl">
          <DropdownMenuLabel className="text-slate-400 font-bold uppercase text-[10px] tracking-widest px-3 py-2">Templates</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-800" />
          {Object.entries(RESUME_TEMPLATES).map(([id, config]) => (
            <DropdownMenuItem
              key={id}
              onClick={() => setTemplateId(id)}
              className={`cursor-pointer transition-colors px-3 py-2 focus:bg-slate-800 focus:text-white ${
                templateId === id ? "bg-slate-800 text-primary font-bold" : "hover:bg-slate-800"
              }`}
            >
              {config.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex flex-col z-20 shadow-sm sticky top-0">
      {/* PRIMARY ROW */}
      <div className="h-14 border-b bg-card flex items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="h-4 w-px bg-border mx-0.5 sm:mx-1" />
          
          <div className="flex items-center bg-muted/50 rounded-lg p-0.5 border border-border/50">
             <Button
               variant={previewMode === "desktop" ? "secondary" : "ghost"}
               size="sm"
               className="h-7 w-7 sm:w-8 p-0"
               onClick={() => setPreviewMode("desktop")}
               title="Desktop View"
             >
               <Monitor className="h-3.5 w-3.5" />
             </Button>
             <Button
               variant={previewMode === "mobile" ? "secondary" : "ghost"}
               size="sm"
               className="h-7 w-7 sm:w-8 p-0"
               onClick={() => setPreviewMode("mobile")}
               title="Mobile View"
             >
               <Smartphone className="h-3.5 w-3.5" />
             </Button>
          </div>

          <div className="h-4 w-px bg-border mx-0.5 sm:mx-1" />

          <div className="flex items-center">
            {isSaving ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 text-blue-500 border border-blue-100">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest hidden xs:inline">Sync</span>
              </div>
            ) : hasChanges ? (
              <Button
                size="sm"
                variant="default"
                onClick={saveResume}
                className="h-8 px-2.5 gap-1.5 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm rounded-full"
                title="Create Snapshot"
              >
                <CloudIcon className="h-3.5 w-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest hidden xs:inline">Snapshot</span>
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100" title="Autosaved">
                <Check className="h-3.5 w-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest hidden xs:inline">Saved</span>
              </div>
            )}
          </div>
          
          <h1 className="font-bold text-xs truncate max-w-[80px] sm:max-w-[180px] ml-1 hidden lg:block">
            {resume?.title || "Resume"}
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Style Settings (Desktop) */}
          <div className="hidden md:flex items-center gap-2 mr-2">
            <ColorPicker />
            <FontSizePicker />
          </div>

          <div className="hidden md:block h-6 w-px bg-border mx-1" />

          {/* Template Selector (Desktop) */}
          <div className="hidden md:block">
            <TemplateSelector />
          </div>

          <Link href="/jobs">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 sm:w-auto sm:px-3 gap-2 text-slate-600 hover:text-slate-900"
              title="Job Match"
            >
              <Briefcase className="h-4 w-4 text-slate-500" />
              <span className="hidden xl:inline text-xs font-bold uppercase tracking-wider">Match</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 sm:w-auto sm:px-3 gap-2 text-slate-600"
            onClick={handleOpenHistory}
            title="Snapshots History"
          >
            <History className="h-4 w-4 text-slate-500" />
            <span className="hidden xl:inline text-xs font-bold uppercase tracking-wider">History</span>
          </Button>

          {/* ── Set Active / Active Button ── */}
          {resume?.isActive ? (
            <div
              className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 cursor-default"
              title="This is your active resume"
            >
              <Zap className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex h-8 px-3 gap-1.5 rounded-lg border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 hover:border-amber-500/50 transition-all"
              onClick={handleActivate}
              title="Set as active resume for AI features"
            >
              <Zap className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">Set Active</span>
            </Button>
          )}

          <div className="hidden sm:block h-6 w-px bg-border" />

          <Button
            variant="secondary"
            size="sm"
            className="h-9 w-9 p-0 sm:w-auto sm:px-4 gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-lg"
            onClick={handleEnhance}
            title="AI Enhance"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Enhance</span>
          </Button>

          <Button
            size="sm"
            className="h-9 w-9 p-0 sm:w-auto sm:px-5 gap-2 font-black shadow-lg shadow-primary/20 rounded-lg"
            onClick={handleDownload}
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
            <span className="hidden xs:inline text-xs font-bold uppercase tracking-wider">Download</span>
          </Button>
        </div>
      </div>

      {/* SECONDARY ROW (Mobile Only) */}
      <div className="h-9 md:hidden border-b bg-muted/40 flex items-center justify-between px-1 overflow-hidden">
          <div className="flex items-center gap-0.5">
            <ColorPicker showLabel />
            <div className="h-3 w-px bg-border/60 shrink-0" />
            <FontSizePicker showLabel />
            <div className="h-3 w-px bg-border/60 shrink-0" />
            <TemplateSelector showLabel />
          </div>
          <div className="sm:hidden">
            {resume?.isActive ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10">
                <Zap className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
            ) : (
              <button
                onClick={handleActivate}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              >
                <Zap className="h-3 w-3 text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Set Active</span>
              </button>
            )}
          </div>
      </div>

      <EnhanceModal
        isOpen={isEnhanceOpen}
        onClose={handleDiscardEnhance}
        originalContent={resume}
        enhancedData={enhanceData}
        onAccept={handleAcceptEnhance}
        onDiscard={handleDiscardEnhance}
      />

      {resume && (
        <VersionHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          versions={versions}
          isLoading={isLoadingHistory}
          onRestore={handleRestoreVersion}
        />
      )}
    </div>
  );
}
