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
import { Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";
import { userRegistrationSchema } from "@/lib/validation";

const registerSchema = userRegistrationSchema;
type RegisterForm = z.infer<typeof registerSchema>;

const PERKS = [
  "Build ATS-optimized resumes instantly",
  "AI enhancement with one click",
  "Match your resume to real job listings",
  "Download pixel-perfect PDFs",
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await signUp(data.username, data.email, data.password);
      toast.success("Account created! Welcome to ResumeAI.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT PANEL (marketing) ── */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-linear-to-br from-violet-700 via-primary to-pink-600 p-12 flex-col justify-between">
        <div className="absolute inset-0">
          <div className="absolute top-[-15%] right-[-10%] w-2/3 h-2/3 bg-white/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-1/2 h-1/2 bg-black/20 blur-[60px] rounded-full" />
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
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
              Your next job<br />starts here.
            </h2>
            <p className="text-white/70 leading-relaxed">
              Create your free account and start building professional resumes in minutes.
            </p>
          </div>
          <ul className="space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-white/90 font-medium text-sm">
                <CheckCircle2 className="h-4 w-4 text-white/70 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-white/50 text-sm">
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </p>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex flex-1 items-center justify-center p-6 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md py-8"
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
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create account</h1>
            <p className="text-muted-foreground">
              Start your journey to a better career today — free forever.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                autoComplete="username"
                {...register("username")}
                className={`h-11 rounded-xl ${errors.username ? "border-destructive" : ""}`}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register("email")}
                className={`h-11 rounded-xl ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("password")}
                    className={`h-11 rounded-xl pr-10 ${errors.password ? "border-destructive" : ""}`}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    className={`h-11 rounded-xl pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-xs text-primary/80 border border-primary/10">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Minimum 6 characters. Your data is encrypted and secure.</span>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-bold rounded-xl shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Get Started — Free"
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">Already have an account?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="mt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full h-11 rounded-xl font-semibold">
                Sign in instead
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
