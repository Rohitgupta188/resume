"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";

import { userLoginSchema } from "@/lib/validation";

const loginSchema = userLoginSchema;
type LoginForm = z.infer<typeof loginSchema>;

const PERKS = [
  "AI-powered resume enhancement",
  "6 professional ATS-ready templates",
  "Real-time job match scoring",
  "Instant PDF export",
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL (marketing) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-r from-primary via-violet-700 to-pink-700 p-12 flex-col justify-between">
        {/* BG blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-2/3 h-2/3 bg-white/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-black/20 blur-[60px] rounded-full" />
        </div>

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur text-white font-black text-base">
              R
            </div>
            <span className="text-white text-xl font-bold">ResumeAI</span>
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-3">
              Build resumes that<br />get you hired.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              AI-powered tools to craft, optimize, and match your resume to real jobs.
            </p>
          </div>

          <ul className="space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-white/90 font-medium">
                <CheckCircle2 className="h-5 w-5 text-white/70 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex flex-col items-center">
            <Link
              href="/"
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-2xl font-black shadow-lg shadow-primary/25"
            >
              R
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register("email")}
                className={`h-11 rounded-xl ${errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`h-11 rounded-xl pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-bold rounded-xl shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">New here?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="mt-4">
            <Link href="/register">
              <Button variant="outline" className="w-full h-11 rounded-xl font-semibold">
                Create an account
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <span className="underline underline-offset-2 cursor-pointer">Terms</span> and{" "}
            <span className="underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
