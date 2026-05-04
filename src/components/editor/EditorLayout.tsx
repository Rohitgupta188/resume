"use client";

import React,{ useState } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { EditorToolbar } from "./EditorToolbar";
import { EditorForm } from "./EditorForm";
import { ResumePreview } from "./ResumePreview";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2, Eye, PenLine } from "lucide-react";

const MemoPreview = React.memo(ResumePreview);

export function EditorLayout() {
  const { isLoading, resume } = useEditor();
  const [tab, setTab] = useState("edit");

  /* ─────────────────────────────────────────────
     LOADING
     ───────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your resume...
        </p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     EMPTY STATE
     ───────────────────────────────────────────── */
  if (!resume) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Unable to load resume.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* TOOLBAR */}
      <EditorToolbar />

      {/* MOBILE */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden">
        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b bg-muted/30">
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

          <TabsContent value="edit" className="flex-1 overflow-auto p-4">
            <EditorForm />
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-auto bg-muted/40 p-4">
            <div className="max-w-[450px] mx-auto shadow-2xl">
              <MemoPreview />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* FORM */}
        <div className="w-[450px] lg:w-[500px] border-r flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <EditorForm />
          </div>
        </div>

        {/* PREVIEW */}
        <div className="flex-1 bg-muted/40 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-[800px] shadow-2xl">
            <MemoPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
