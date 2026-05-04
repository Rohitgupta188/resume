"use client";

import { useCallback, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import { updateResumeSchema } from "@/lib/validation";
import { ZodError } from "zod";

/* ═══════════════════════════════════════════════
   RESUME HOOKS — CRUD + Features
   ═══════════════════════════════════════════════ */

interface ResumeListItem {
  _id: string;
  title: string;
  templateId?: string;
  atsScore?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  content: any;
}

interface ResumeDetail extends ResumeListItem {
  userId: string;
  rawText?: string;
  pdfUrl?: string;
}

export function useResumes() {
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = query
        ? `/api/resume?q=${encodeURIComponent(query)}`
        : "/api/resume";
      const data = await api.get<{ resumes: ResumeListItem[] }>(url);
      setResumes(data.resumes);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to fetch resumes";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createResume = useCallback(async (title: string, content?: any) => {
    const defaultContent = content || {
      personalInfo: { name: "", email: "" },
      summary: "",
      education: [],
      skills: [],
      experience: [],
      projects: [],
      certifications: [],
      languages: [],
    };

    try {
      const data = await api.post<{ resume: ResumeDetail }>("/api/resume", {
        title,
        content: defaultContent,
      });
      return data.resume;
    } catch (err) {
      toast.error("Failed to create resume");
      throw err;
    }
  }, []);

  const deleteResume = useCallback(async (id: string) => {
    try {
      await api.delete(`/api/resume/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  }, []);

  return {
    resumes,
    isLoading,
    error,
    fetchResumes,
    createResume,
    deleteResume,
  };
}

export function useResumeDetail() {
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResume = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<{ resume: ResumeDetail }>(`/api/resume/${id}`);
      setResume(data.resume);
      return data.resume;
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Failed to fetch resume";
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateResume = useCallback(
    async (id: string, updates: any, toastOptions?: { id?: string }) => {
      // Client-side validation
      const result = updateResumeSchema.safeParse(updates);
      if (!result.success) {
        const details = result.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        const msg = `Client validation failed: ${details}`;
        toast.error(msg, toastOptions);
        console.warn(
          "Update blocked by client-side validation:",
          result.error.format(),
        );
        return null;
      }

      setIsSaving(true);
      try {
        const data = await api.patch<{ resume: ResumeDetail }>(
          `/api/resume/${id}`,
          result.data,
        );
        setResume(data.resume);
        return data.resume;
      } catch (err) {
        let msg = "Failed to save changes";
        if (err instanceof ApiError) {
          msg = err.message;
          if (err.details && Array.isArray(err.details)) {
            const details = err.details
              .map((d: any) => `${d.field.split(".").pop()}: ${d.message}`)
              .join(", ");
            msg = `${err.message}: ${details}`;
          }
        }
        toast.error(msg, toastOptions);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const downloadPDF = useCallback(
    async (id: string, title: string, templateId?: string) => {
      const filename = `${title || "resume"}`
        .toLowerCase()
        .replace(/\s+/g, "-");
      try {
        toast.info("Preparing your PDF...");
        const url = templateId
          ? `/api/resume/${id}/pdf?templateId=${templateId}`
          : `/api/resume/${id}/pdf`;
        await api.download(url, `${filename}.pdf`);
        toast.success("Download complete!");
      } catch {
        toast.error("Failed to download PDF");
      }
    },
    [],
  );

  const activateResume = useCallback(async (id: string) => {
    try {
      await api.patch<{ message: string }>(`/api/resume/${id}/activate`);
      setResume((prev: any) => (prev ? { ...prev, isActive: true } : null));
      toast.success("Resume set as active!");
    } catch (err) {
      toast.error("Failed to set active resume");
      throw err;
    }
  }, []);

  const enhanceResume = useCallback(async (id: string) => {
    try {
      toast.loading("AI is enhancing your resume...", { id: "enhance" });

      const data = await api.post<{
        atsScore: number;
        improvedContent: any;
        analysis: any;
        message?: string;
      }>(`/api/resume/${id}/enhance`);

      toast.success(data.message || "Enhancement ready!", { id: "enhance" });

      return data; // IMPORTANT → send to modal
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "AI enhancement failed";
      toast.error(msg, { id: "enhance" });
      throw err;
    }
  }, []);

  const applyEnhancement = useCallback(
    async (
      id: string,
      improvedContent: any,
      atsScore: number,
      contentHash: string,
    ) => {
      // 1. Add contentHash here
      try {
        toast.loading("Applying changes...", { id: "apply" });

        const data = await api.post<{
          resume: ResumeDetail;
          atsScore: number;
        }>(`/api/resume/${id}/apply-enhancement`, {
          improvedContent,
          atsScore,
          contentHash, // 2. Include it in the request body
        });

        setResume(data.resume);

        toast.success("Enhancement applied!", { id: "apply" });

        return data.resume;
      } catch (err) {
        const msg =
          err instanceof ApiError ? err.message : "Failed to apply changes";
        toast.error(msg, { id: "apply" });
        throw err;
      }
    },
    [],
  );

  return {
    resume,
    isLoading,
    isSaving,
    error,
    setResume,
    fetchResume,
    updateResume,
    downloadPDF,
    activateResume,
    enhanceResume,
    applyEnhancement,
  };
}
