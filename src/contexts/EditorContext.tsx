"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useResumeDetail } from "@/hooks/useResume";
import { toast } from "sonner";
import { debounce } from "lodash";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface EditorContextValue {
  resume: any;
  setResume: (updates: any) => void;
  isSaving: boolean;
  isLoading: boolean;
  templateId: string;
  setTemplateId: (id: string) => void;
  saveResume: () => Promise<void>;
  activateResume: () => Promise<void>;
  activeSection: string;
  setActiveSection: (section: string) => void;
  previewMode: "desktop" | "mobile";
  setPreviewMode: (mode: "desktop" | "mobile") => void;

  //  AI Integration
  applyAIEnhancement: (content: any, score: number, hash: string) => Promise<any>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}

/* ═══════════════════════════════════════════════
   PROVIDER
   ═══════════════════════════════════════════════ */

export function EditorProvider({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    resume,
    fetchResume,
    updateResume,
    activateResume: apiActivate,
    applyEnhancement,
    isSaving,
    isLoading,
  } = useResumeDetail();

  const [localResume, setLocalResume] = useState<any>(null);
  const [templateId, setTemplateId] = useState("modern");
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [hasChanges, setHasChanges] = useState(false);

  /* ─────────────────────────────────────────────
     FETCH RESUME
     ───────────────────────────────────────────── */
  useEffect(() => {
    fetchResume(id);
  }, [id, fetchResume]);

  /* ─────────────────────────────────────────────
     SYNC SERVER → LOCAL STATE
     ───────────────────────────────────────────── */
  useEffect(() => {
    if (resume) {
      setLocalResume((prev: any) => {
        if (!prev) return resume;

        return {
          ...prev,
          ...resume,
          content: prev.content ?? resume.content,
        };
      });

      if (resume.templateId) {
        setTemplateId(resume.templateId);
      }
    }
  }, [resume]);

  /* ─────────────────────────────────────────────
     SET RESUME CONTENT (SAFE)
     ───────────────────────────────────────────── */
  const setResumeContent = useCallback((updates: any) => {
    setLocalResume((prev: any) => {
      if (!prev) return prev;

      const updatedContent =
        typeof updates === "function"
          ? updates(prev.content)
          : updates;

      return {
        ...prev,
        content: updatedContent,
      };
    });

    setHasChanges(true);
  }, []);

  /* ─────────────────────────────────────────────
     AUTO SAVE (DEBOUNCED)
     ───────────────────────────────────────────── */
  const debouncedSave = useRef(
    debounce(
      async (resumeId: string, content: any, template: string) => {
        try {
          await updateResume(
            resumeId,
            { content, templateId: template },
            { id: "auto-save" }
          );
          setHasChanges(false);
        } catch (err: any) {
          console.error("Auto-save failed:", err.message);
        }
      },
      2000
    )
  ).current;

  useEffect(() => {
    if (hasChanges && localResume) {
      debouncedSave(id, localResume.content, templateId);
    }
  }, [id, localResume, templateId, hasChanges, debouncedSave]);

  /*  CLEANUP DEBOUNCE */
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  /* ─────────────────────────────────────────────
     MANUAL SAVE
     ───────────────────────────────────────────── */
  const saveResume = useCallback(async () => {
    if (!localResume || !hasChanges) return;

    try {
      await updateResume(id, {
        content: localResume.content,
        templateId,
      });

      setHasChanges(false);
      toast.success("All changes saved");
    } catch {
      // handled in hook
    }
  }, [id, localResume, templateId, updateResume, hasChanges]);

  /* ─────────────────────────────────────────────
     ACTIVATE RESUME
     ───────────────────────────────────────────── */
  const activateResume = useCallback(async () => {
    await apiActivate(id);
  }, [id, apiActivate]);

  /* ─────────────────────────────────────────────
     APPLY AI ENHANCEMENT (CRITICAL)
     ───────────────────────────────────────────── */
  const applyAIEnhancement = useCallback(
    async (improvedContent: any, atsScore: number, contentHash: string) => {
      const updated = await applyEnhancement(id, improvedContent, atsScore, contentHash);

      // ✅ Sync UI instantly, preserving computed fields like isActive
      setLocalResume((prev: any) => ({
        ...prev,
        ...updated,
      }));
      setHasChanges(false);

      return updated;
    },
    [id, applyEnhancement]
  );

  /* ─────────────────────────────────────────────
     CONTEXT VALUE
     ───────────────────────────────────────────── */
  const value = useMemo(
    () => ({
      resume: localResume,
      setResume: setResumeContent,
      isSaving,
      isLoading,
      templateId,
      setTemplateId,
      saveResume,
      activateResume,
      activeSection,
      setActiveSection,
      previewMode,
      setPreviewMode,
      applyAIEnhancement, //  exposed
    }),
    [
      localResume,
      setResumeContent,
      isSaving,
      isLoading,
      templateId,
      saveResume,
      activateResume,
      activeSection,
      previewMode,
      applyAIEnhancement,
    ]
  );

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}
