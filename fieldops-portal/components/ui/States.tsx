import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Multi-ring orbital spinner. */
export function Spinner({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("animate-spin", className)}
      style={{ color: "var(--color-brand)" }}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="grid place-items-center gap-3 py-16">
      <Spinner size={30} />
      <p className="text-xs font-medium text-[var(--color-fg-muted)]">{label}</p>
    </div>
  );
}

export function ShimmerRows({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shimmer h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center gap-3 rounded-lg border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-14 text-center">
      {icon && <div className="text-[var(--color-fg-subtle)]">{icon}</div>}
      <div>
        <p className="text-sm font-semibold text-[var(--color-fg)]">{title}</p>
        {description && <p className="mx-auto mt-1 max-w-sm text-xs text-[var(--color-fg-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="grid place-items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center">
      <p className="text-sm font-semibold text-[var(--color-danger)]">Something went wrong</p>
      <p className="max-w-sm text-xs text-[var(--color-fg-muted)]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--color-surface-2)]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
