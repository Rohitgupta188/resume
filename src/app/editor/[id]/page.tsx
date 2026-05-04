"use client";

import { useParams } from "next/navigation";
import { EditorProvider } from "@/contexts/EditorContext";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function EditorPage() {
  const params = useParams();
  const id = params.id as string;
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

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
