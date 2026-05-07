"use client";

import React, { useState } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { useParams } from "next/navigation";
import { EditorToolbar } from "./EditorToolbar";
import { EditorForm } from "./EditorForm";
import { ResumePreview } from "./ResumePreview";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2, Eye, PenLine, AlertCircle, RefreshCcw, FileQuestion, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MemoPreview = React.memo(ResumePreview);

export function EditorLayout() {
  const { isLoading, resume, error, fetchResume, previewMode, setPreviewMode } = useEditor();
  const [tab, setTab] = useState("edit");
  const params = useParams();
  const id = params?.id as string;

  // Sync tab state with previewMode from context
  React.useEffect(() => {
    if (previewMode === "mobile") {
      setTab("preview");
    } else {
      setTab("edit");
    }
  }, [previewMode]);

  const handleTabChange = (val: string) => {
    setTab(val);
    // Also update context so toolbar icons stay in sync
    setPreviewMode(val === "edit" ? "desktop" : "mobile");
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-950/50 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative flex flex-col items-center gap-6 z-10">
          <div className="relative flex items-center justify-center w-20 h-20">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" style={{ animationDuration: '1.5s' }} />
            {/* Inner pulsating core */}
            <div className="w-10 h-10 bg-primary/10 rounded-full animate-pulse flex items-center justify-center">
              <PenLine className="w-5 h-5 text-primary" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Setting up your workspace
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
              Loading your resume data and templates...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
        <div className="bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/30 p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Failed to load resume</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <Button onClick={() => fetchResume(id)} className="gap-2">
              <RefreshCcw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
        <div className="text-center max-w-md w-full p-8">
          <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Resume Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            The resume you are looking for does not exist or has been deleted.
          </p>
          <Link href="/dashboard">
            <Button className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden editor-ui">
      <EditorToolbar />

      {/* MOBILE */}
      <div className="flex-1 flex flex-col md:hidden min-h-0">
        <Tabs value={tab} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-2 border-b bg-muted/30 shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="gap-2">
                <PenLine className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="edit" className="flex-1 overflow-y-auto p-4 min-h-0 outline-none">
            <EditorForm />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-y-auto bg-muted/40 p-4 min-h-0 outline-none">
            <div className="max-w-[450px] mx-auto shadow-2xl bg-white">
              <MemoPreview />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-[450px] lg:w-[500px] border-r flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <EditorForm />
          </div>
        </div>
        <div className="flex-1 bg-muted/40 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-[800px] shadow-2xl">
            <MemoPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
