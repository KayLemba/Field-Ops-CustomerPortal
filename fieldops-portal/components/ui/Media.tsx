"use client";

import { FileText } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { API_BASE } from "@/lib/api/client";

/** Build an absolute URL to a protected /uploads asset, carrying the JWT as ?token= */
export function useMediaUrl() {
  const { token } = useAuth();
  return (url: string | null | undefined) => {
    if (!url) return undefined;
    const abs = url.startsWith("http") ? url : `${API_BASE}${url}`;
    return token ? `${abs}${abs.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}` : abs;
  };
}

export function AuthedImage({ src, alt }: { src: string; alt: string }) {
  const mediaUrl = useMediaUrl();
  const url = mediaUrl(src);
  return (
    <a href={url} target="_blank" rel="noreferrer" title="Open image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} className="h-20 w-20 rounded-md border border-[var(--color-border)] object-cover" />
    </a>
  );
}

export function AuthedFileLink({ src, name }: { src: string; name?: string | null }) {
  const mediaUrl = useMediaUrl();
  const label = name || src.split("/").pop() || "Document";
  return (
    <a
      href={mediaUrl(src)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-full items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]"
    >
      <FileText size={15} className="shrink-0 text-[var(--color-brand)]" />
      <span className="truncate">{label}</span>
    </a>
  );
}
