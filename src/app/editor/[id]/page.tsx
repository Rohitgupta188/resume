"use client";

import { useParams, useSearchParams } from "next/navigation";
import { EditorProvider } from "@/contexts/EditorContext";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { printResume } from "@/lib/pdf-service";

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Auto-print when navigated from dashboard with ?print=1
  const shouldPrint = searchParams.get("print") === "1";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!shouldPrint) return;
    // Wait for the resume to fully render in the print root before printing.
    // 1200ms gives EditorProvider time to fetch + render the template.
    const timer = setTimeout(() => {
      printResume({ onBefore: () => {} });
    }, 1200);
    return () => clearTimeout(timer);
  }, [shouldPrint]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
         <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <EditorProvider id={id}>
      <EditorLayout />
    </EditorProvider>
  );
}
