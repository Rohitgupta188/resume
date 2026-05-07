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
  moveSection: (sectionId: string, direction: "up" | "down") => void;

  //  AI Integration
  applyAIEnhancement: (content: any, score: number, hash: string) => Promise<any>;

  // Error and Fetching
  error: string | null;
  fetchResume: (id: string) => Promise<any>;
  hasChanges: boolean;
  themeColor: string;
  setThemeColor: (color: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
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
    error,
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
     MOVE SECTION (REORDER)
     ───────────────────────────────────────────── */
  const moveSection = useCallback((sectionId: string, direction: "up" | "down") => {
    setLocalResume((prev: any) => {
      if (!prev) return prev;
      const currentOrder = prev.content.sectionOrder || [
        "summary", "experience", "education", "projects", "skills", "certifications", "languages", "customSections"
      ];
      
      const idx = currentOrder.indexOf(sectionId);
      if (idx === -1) return prev;

      const newOrder = [...currentOrder];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      
      if (targetIdx < 0 || targetIdx >= newOrder.length) return prev;

      // Swap
      [newOrder[idx], newOrder[targetIdx]] = [newOrder[targetIdx], newOrder[idx]];

      return {
        ...prev,
        content: {
          ...prev.content,
          sectionOrder: newOrder
        }
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
     UNSAVED WARNING
     ───────────────────────────────────────────── */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges || isSaving) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges, isSaving]);

  /* ─────────────────────────────────────────────
     MANUAL SAVE
     ───────────────────────────────────────────── */
  const saveResume = useCallback(async () => {
    if (!localResume || !hasChanges) return;

    try {
      await updateResume(id, {
        content: localResume.content,
        templateId,
        createVersion: true,
      });

      setHasChanges(false);
      toast.success("All changes saved (Version created)");
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
      moveSection,
      applyAIEnhancement, //  exposed
      error,
      fetchResume,
      hasChanges,
      themeColor: localResume?.content?.themeColor || "#7c2d3e",
      setThemeColor: (color: string) => setResumeContent((prev: any) => ({ ...prev, themeColor: color })),
      fontSize: localResume?.content?.fontSize || "normal",
      setFontSize: (size: string) => setResumeContent((prev: any) => ({ ...prev, fontSize: size })),
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
      moveSection,
      applyAIEnhancement,
      error,
      fetchResume,
      hasChanges,
      localResume?.content?.themeColor,
      localResume?.content?.fontSize,
    ]
  );

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}
