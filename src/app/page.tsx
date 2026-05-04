"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Zap,
  Layout,
  FileText,
  BarChart3,
  ArrowRight,
  Briefcase,
  Star,
  Heart
} from "lucide-react";

const FEATURES = [
  {
    icon: <Layout className="h-5 w-5" />,
    title: "Split-Screen Editor",
    description: "Edit on the left, preview live on the right. No context switching, ever.",
    color: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    iconColor: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Optimization",
    description: "One click to rewrite bullet points and optimize for any job description.",
    color: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
    iconColor: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "6 ATS-Ready Templates",
    description: "Recruiter-approved designs that bypass automated screening systems.",
    color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
    iconColor: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "ATS Score Analysis",
    description: "Real-time AI feedback on your resume's strength, readability, and impact.",
    color: "from-orange-500/20 to-orange-600/5 border-orange-500/20",
    iconColor: "text-orange-500 bg-orange-500/10",
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    title: "Job Match AI",
    description: "Search jobs and instantly see how well your resume matches each listing.",
    color: "from-pink-500/20 to-pink-600/5 border-pink-500/20",
    iconColor: "text-pink-500 bg-pink-500/10",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Instant PDF Export",
    description: "Download pixel-perfect PDFs in seconds, ready to send.",
    color: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/20",
    iconColor: "text-yellow-500 bg-yellow-500/10",
  },
];

const STATS = [
  { value: "6", label: "Pro Templates" },
  { value: "AI", label: "Powered Match" },
  { value: "ATS", label: "Optimized" },
  { value: "PDF", label: "Instant Export" },
];

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  const ctaHref = isAuthenticated ? "/dashboard" : "/register";
  const ctaText = isAuthenticated ? "Go to Dashboard" : "Start Building — Free";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="relative pt-24 pb-28 overflow-hidden">
          {/* BG blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-[-20%] left-[-5%] w-[50%] h-[50%] bg-primary/8 blur-[100px] rounded-full" />
            <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-violet-500/8 blur-[100px] rounded-full" />
            <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-pink-500/5 blur-[80px] rounded-full" />
          </div>

          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-primary/20 rounded-full bg-primary/5 text-primary mb-8">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI-Powered Resume Builder</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
                Land Your Dream Job{" "}
                <br className="hidden md:block" />
                with{" "}
                <span className="relative inline-block">
                  <span className="bg-linear-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">AI-Powered</span>
                </span>{" "}
                Resumes
              </h1>

              <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed">
                Build professional, ATS-optimized resumes in minutes. Get AI suggestions,
                match against real job listings, and download stunning PDFs instantly.
              </p>

              {!isLoading && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href={ctaHref}>
                    <Button
                      size="lg"
                      className="h-12 px-8 text-base font-bold shadow-xl shadow-primary/25 gap-2"
                    >
                      {ctaText}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {!isAuthenticated && (
                    <Link href="/login">
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 text-base font-semibold"
                      >
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Social proof */}
              <div className="mt-8 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-4 w-4 fill-red-400 text-red-400" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground font-medium">
                  Loved by job seekers
                </span>
              </div>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm px-4 py-4"
                >
                  <span className="text-2xl font-extrabold text-primary">{s.value}</span>
                  <span className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* App mockup */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-16 relative max-w-4xl mx-auto"
            >
              <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-2 shadow-2xl shadow-primary/10">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/40">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                  <div className="ml-3 flex-1 h-5 max-w-xs rounded-md bg-muted/60 flex items-center px-2">
                    <span className="text-[10px] text-muted-foreground">resumeai.app/editor</span>
                  </div>
                </div>
                {/* Mock editor */}
                <div className="aspect-video bg-background/40 rounded-lg overflow-hidden flex">
                  {/* Left panel */}
                  <div className="w-2/5 border-r border-border/40 p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-muted rounded-full" />
                      <div className="h-2 w-10 bg-primary/30 rounded-full" />
                    </div>
                    <div className="h-8 w-full bg-muted/60 rounded-lg" />
                    <div className="h-8 w-full bg-muted/60 rounded-lg" />
                    <div className="h-2 w-20 bg-muted rounded-full mt-1" />
                    <div className="h-16 w-full bg-muted/40 rounded-lg border border-border/40" />
                    <div className="mt-auto h-8 w-full bg-primary/15 border border-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-[9px] font-bold text-primary tracking-widest uppercase">✨ AI Enhance</span>
                    </div>
                  </div>
                  {/* Right panel — resume preview */}
                  <div className="flex-1 bg-white/5 p-6">
                    <div className="h-full border border-border/30 rounded-lg bg-white/3 p-5 flex flex-col gap-2.5 shadow-sm">
                      <div className="h-2.5 w-1/2 bg-foreground/15 mx-auto rounded-full" />
                      <div className="h-1.5 w-3/4 bg-muted/70 mx-auto rounded-full" />
                      <div className="h-1.5 w-1/2 bg-muted/50 mx-auto rounded-full" />
                      <div className="h-px w-full bg-border/60 my-1" />
                      {[1,2,3].map(i => (
                        <div key={i} className="space-y-1.5">
                          <div className="h-1.5 w-1/3 bg-foreground/10 rounded-full" />
                          <div className="h-1 w-full bg-muted/50 rounded-full" />
                          <div className="h-1 w-5/6 bg-muted/40 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow under mockup */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-primary/20 blur-2xl rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-24 border-t border-border/40">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-border/60 rounded-full bg-muted/40 text-muted-foreground mb-4">
                Everything you need
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
                Professional Features
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Everything you need to stand out in the modern job market, powered by AI.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-2xl border bg-linear-to-r ${feature.color} hover:shadow-xl hover:shadow-primary/5 transition-all duration-200`}
                >
                  <div className={`h-10 w-10 rounded-xl ${feature.iconColor} flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section className="py-24 border-t border-border/40">
          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-violet-500/5 to-background p-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-r from-primary/10 to-transparent" />
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-extrabold mb-3 tracking-tight">
                    Ready to land that job?
                  </h2>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Join thousands of job seekers who have upgraded their resumes with ResumeAI.
                  </p>
                  <Link href={ctaHref}>
                    <Button size="lg" className="h-12 px-10 font-bold text-base shadow-xl shadow-primary/25 gap-2">
                      {ctaText}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container px-4 mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-black text-xs">
              R
            </div>
            <span className="font-semibold text-foreground/80">ResumeAI</span>
          </div>
          <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
