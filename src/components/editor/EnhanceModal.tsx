"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from "lucide-react";

interface EnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalContent: any;
  enhancedData: {
    improvedContent: any;
    atsScore: number;
    analysis?: any;
    contentHash?: string;
  } | null;
  onAccept: (data: {
    improvedContent: any;
    atsScore: number;
    contentHash: string; // Required
  }) => void;
  onDiscard: () => void;
}

export function EnhanceModal({
  isOpen,
  onClose,
  originalContent,
  enhancedData,
  onAccept,
  onDiscard,
}: EnhanceModalProps) {
  if (!enhancedData) return null;

  // Extraction logic to handle potential nesting
  const improvedContent = enhancedData.improvedContent;
  const atsScore = enhancedData.atsScore;
  const analysis = enhancedData.analysis;
  
  // 🔥 CRITICAL: Fallback check for the hash location
  const contentHash = enhancedData.contentHash || enhancedData.analysis?.contentHash;

  const oldScore = originalContent?.atsScore || 0;
  const diff = atsScore - oldScore;

  const getSafeContent = (data: any) => {
    if (!data) return {};
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch { return {}; }
    }
    return data.content || data;
  };

  const safeOriginal = getSafeContent(originalContent?.content);
  const safeImproved = getSafeContent(improvedContent);

  const handleApply = () => {
    if (!contentHash) {
      console.error("Cannot apply enhancement: contentHash is missing.");
      return;
    }

    onAccept({
      improvedContent: safeImproved,
      atsScore,
      contentHash, // Sending it back to the parent
    });
  };

  const renderSection = (data: any) => (
    <div className="space-y-5 text-sm">
      {data.summary && (
        <div>
          <p className="font-bold text-sm uppercase text-muted-foreground mb-1">Summary</p>
          <p className="leading-relaxed">{data.summary}</p>
        </div>
      )}
      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <div>
          <p className="font-bold text-sm uppercase text-muted-foreground mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((s: string, i: number) => (
              <Badge key={i} variant="secondary">{s}</Badge>
            ))}
          </div>
        </div>
      )}
      {Array.isArray(data.projects) && (
        <div>
          <p className="font-bold text-sm uppercase text-muted-foreground mb-2">Projects</p>
          <div className="space-y-3">
            {data.projects.map((p: any, i: number) => (
              <div key={i} className="p-3 rounded border bg-card text-card-foreground">
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs mt-1 opacity-80">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onDiscard()}>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Sparkles className="text-blue-500 h-6 w-6" />
              <div>
                <DialogTitle>AI Improvement Draft</DialogTitle>
                <DialogDescription>Review and apply optimized sections.</DialogDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-muted p-2 rounded-lg">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold">Current</p>
                <p className="line-through opacity-50">{oldScore}%</p>
              </div>
              <ArrowRight className="h-4 w-4 opacity-50" />
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-blue-600">AI Score</p>
                <p className="font-bold text-lg text-blue-600">{atsScore}%</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background p-5 rounded-xl border shadow-sm">
              <Badge variant="outline" className="mb-4">Original</Badge>
              {renderSection(safeOriginal)}
            </div>
            <div className="bg-background p-5 rounded-xl border-2 border-blue-200 dark:border-blue-900 shadow-md">
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-600">Improved Version</Badge>
              {renderSection(safeImproved)}
            </div>
          </div>

          {analysis?.suggestions?.length > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900">
              <h4 className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-400 mb-2">
                <AlertCircle className="h-4 w-4" /> Optimization Tips
              </h4>
              <ul className="text-sm space-y-1 text-amber-900 dark:text-amber-300 list-disc ml-5">
                {analysis.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-background">
          <Button variant="ghost" onClick={onDiscard}>
            <ThumbsDown className="mr-2 h-4 w-4" /> Discard
          </Button>
          <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
            <ThumbsUp className="mr-2 h-4 w-4" /> Apply to Resume
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}