"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(identifier, password);
      router.push("/reports");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-10"
      style={{ background: "var(--color-bg)" }}
    >
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-[28px] shadow-xl"
        style={{ background: "var(--color-surface)" }}
      >
        {/* Header: brand-colored panel with a wave transition into the form body */}
        <div
          className="relative overflow-hidden px-8 pb-14 pt-9"
          style={{ background: "linear-gradient(135deg, var(--color-brand-700), var(--color-brand-800))" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-2xl"
            style={{ background: "rgba(255,255,255,0.14)" }}
          />
          <p className="relative text-sm font-medium text-white/70">Sign in to</p>
          <h1 className="relative mt-1 text-3xl font-extrabold tracking-tight text-white">
            Field<span style={{ color: "#F7B6D0" }}>Ops</span>
          </h1>
          <svg
            aria-hidden
            viewBox="0 0 420 40"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-10 w-full"
          >
            <path d="M0,20 C 105,45 315,-5 420,20 L420,40 L0,40 Z" fill="var(--color-surface)" />
          </svg>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 pt-2">
          <h2 className="text-[28px] font-extrabold leading-tight" style={{ color: "var(--color-fg)" }}>
            Welcome
            <br />
            <span style={{ color: "var(--color-brand)" }}>back</span>
          </h2>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
            <div
              className="flex items-center gap-2.5 border-b-2 pb-2 transition-colors focus-within:border-[var(--color-brand)]"
              style={{ borderColor: "var(--color-border-strong)" }}
            >
              <Mail className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--color-brand)" }} />
              <input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
                placeholder="Email or phone"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-fg-subtle)]"
                style={{ color: "var(--color-fg)" }}
              />
            </div>

            <div
              className="flex items-center gap-2.5 border-b-2 pb-2 transition-colors focus-within:border-[var(--color-brand)]"
              style={{ borderColor: "var(--color-border-strong)" }}
            >
              <Lock className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--color-brand)" }} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="Password"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-fg-subtle)]"
                style={{ color: "var(--color-fg)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]"
              >
                {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            </div>

            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

            <div className="mt-1 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                aria-label="Log in"
                className="grid h-14 w-14 place-items-center rounded-full text-white shadow-lg transition-transform active:scale-95 disabled:opacity-60"
                style={{ background: "var(--color-brand)" }}
              >
                {loading ? (
                  <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                ) : (
                  <ArrowRight className="h-6 w-6" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <p className="mt-6 text-center text-xs" style={{ color: "var(--color-fg-subtle)" }}>
        Need access? Ask your manager · FieldOps by Tactivo Technologies
      </p>
    </div>
  );
}
