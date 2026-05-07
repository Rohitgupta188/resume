"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResumes } from "@/hooks/useResume";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Edit2,
  Clock,
  Loader2,
  Download,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getScoreColor(score?: number) {
  if (!score) return "text-muted-foreground";
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

function getScoreBg(score?: number) {
  if (!score) return "bg-muted/20 border-border/40";
  if (score >= 80) return "bg-green-500/10 border-green-500/20";
  if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
  return "bg-red-500/10 border-red-500/20";
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { resumes, isLoading, fetchResumes, createResume, deleteResume } = useResumes();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  useEffect(() => {
    const t = setTimeout(() => fetchResumes(search || undefined), 400);
    return () => clearTimeout(t);
  }, [search, fetchResumes]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      const resume = await createResume(newTitle.trim());
      router.push(`/editor/${resume._id}`);
    } catch {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteResume(deleteTarget);
    setDeleteTarget(null);
  };

  // Stats
  const activeResume = resumes.find((r) => r.isActive);
  const avgAts =
    resumes.length > 0
      ? Math.round(
          resumes.filter((r) => r.atsScore).reduce((a, r) => a + (r.atsScore ?? 0), 0) /
            (resumes.filter((r) => r.atsScore).length || 1)
        )
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 min-h-screen"
    >
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">
            {getGreeting()}{user?.username ? `, ${user.username}` : ""} 👋
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">My Resumes</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Design, edit, and optimize your professional profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resumes..."
              className="pl-9 h-10 rounded-xl bg-muted/40 border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-10 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 shrink-0"
          >
            <Plus className="h-4 w-4" />
            New Resume
          </Button>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      {!isLoading && resumes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              icon: <FileText className="h-4 w-4 text-primary" />,
              label: "Total Resumes",
              value: resumes.length,
              bg: "bg-primary/5 border-primary/10",
            },
            {
              icon: <Zap className="h-4 w-4 text-green-500" />,
              label: "Active Resume",
              value: activeResume ? activeResume.title : "None",
              small: true,
              bg: "bg-green-500/5 border-green-500/10",
            },
            {
              icon: <TrendingUp className="h-4 w-4 text-yellow-500" />,
              label: "Avg ATS Score",
              value: avgAts ? `${avgAts}%` : "—",
              bg: "bg-yellow-500/5 border-yellow-500/10",
            },
            {
              icon: <Sparkles className="h-4 w-4 text-violet-500" />,
              label: "Job Match AI",
              value: "Active",
              link: "/jobs",
              bg: "bg-violet-500/5 border-violet-500/10",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 rounded-2xl border p-4 ${s.bg} ${s.link ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
              onClick={() => s.link && router.push(s.link)}
            >
              <div className="shrink-0">{s.icon}</div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className={`font-bold truncate ${s.small ? "text-xs" : "text-base"}`}>
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Create card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCreateOpen(true)}
          className="cursor-pointer min-h-[260px]"
        >
          <Card className="flex flex-col items-center justify-center h-full border-dashed border-2 hover:border-primary/50 hover:bg-primary/3 transition-all rounded-2xl gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm">Create Resume</p>
              <p className="text-xs text-muted-foreground mt-0.5">Start from scratch</p>
            </div>
          </Card>
        </motion.div>

        {/* Skeletons */}
        {isLoading && resumes.length === 0
          ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border-none shadow-sm bg-muted/10 h-[260px] rounded-2xl">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-6 w-1/3 rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </CardContent>
              </Card>
            ))
          : resumes.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Build your first resume 🚀</h2>
                <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                  Pick a template, customize it with AI, and download instantly.
                </p>
                <Button
                  onClick={() => setCreateOpen(true)}
                  className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20"
                >
                  Create Resume
                </Button>
              </div>
            )}

        {/* Resume cards */}
        <AnimatePresence>
          {resumes.map((resume) => {
            const content = resume.content || {};
            const name = content.personalInfo?.name || "Incomplete Profile";
            const email = content.personalInfo?.email || "";
            const skills = Array.isArray(content.skills)
              ? content.skills.slice(0, 4).join(" · ")
              : "";

            return (
              <motion.div
                key={resume._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                onClick={() => router.push(`/editor/${resume._id}`)}
                className="cursor-pointer"
              >
                <Card className="group relative overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/8 transition-all duration-200 bg-card flex flex-col min-h-[260px] rounded-2xl">
                  {/* Gradient accent top */}
                  <div className="h-1 bg-linear-to-r from-primary via-violet-500 to-pink-500" />

                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-r from-primary/3 via-transparent to-transparent pointer-events-none" />

                  {/* Quick actions */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 z-10">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7 rounded-lg shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to editor which has the print root — print triggers automatically
                        router.push(`/editor/${resume._id}?print=1`);
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7 rounded-lg shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/editor/${resume._id}`);
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7 rounded-lg shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(resume._id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary shrink-0 text-sm">
                        {resume.title?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-bold truncate">
                          {resume.title}
                        </CardTitle>
                        <div className="flex items-center text-[10px] text-muted-foreground gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(resume.updatedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        className={`rounded-lg text-xs font-semibold border ${
                          resume.isActive
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-muted/40 text-muted-foreground border-border/40"
                        }`}
                      >
                        {resume.isActive ? "✦ Active" : "Draft"}
                      </Badge>
                      {resume.atsScore && (
                        <div
                          className={`text-xs font-bold px-2 py-1 rounded-lg border ${getScoreBg(resume.atsScore)}`}
                        >
                          <span className={getScoreColor(resume.atsScore)}>
                            ATS {resume.atsScore}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mini preview */}
                    <div className="rounded-xl border border-border/40 bg-muted/20 p-3 text-xs space-y-1.5 group-hover:border-primary/20 transition-colors">
                      <div className="font-bold text-foreground/80 truncate">{name}</div>
                      {email && (
                        <div className="text-muted-foreground truncate">{email}</div>
                      )}
                      {skills && (
                        <>
                          <div className="h-px bg-border/40" />
                          <div className="text-[10px] text-muted-foreground/70 truncate tracking-tight">
                            {skills}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pb-5">
                    <Button className="w-full rounded-xl font-bold h-9 text-sm shadow-md shadow-primary/10 group-hover:shadow-primary/20 transition-all">
                      Open Editor
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── JOB MATCH BANNER ── */}
      {!isLoading && resumes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 via-violet-500/5 to-transparent p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Try AI Job Match</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Search real jobs and get an instant AI match score for your active resume.
              </p>
            </div>
          </div>
          <Link href="/jobs">
            <Button variant="outline" className="rounded-xl font-semibold gap-2 border-primary/30 hover:bg-primary/5 shrink-0">
              <Zap className="h-4 w-4 text-primary" />
              Match Jobs
            </Button>
          </Link>
        </motion.div>
      )}

      {/* ── CREATE DIALOG ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">New Resume</DialogTitle>
            <DialogDescription>Give your resume a title to get started.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g. Frontend Developer"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="h-11 rounded-xl"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating || !newTitle.trim()}
              className="rounded-xl font-bold gap-2"
            >
              {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE DIALOG ── */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="rounded-2xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Resume?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All versions and match history will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl font-bold">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
