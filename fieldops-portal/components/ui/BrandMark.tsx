import { cn } from "@/lib/utils";

/** Simple "f" glyph in the brand color, used as the compact app mark. */
export function BrandGlyph({ size = 28, onDark = false }: { size?: number; onDark?: boolean }) {
  const brand = onDark ? "#F06292" : "var(--color-brand)";
  const ink = onDark ? "#FFFFFF" : "var(--color-fg)";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M20 6h9l4 4-6 6h-7V6Z" fill={brand} />
      <rect x="12" y="15" width="21" height="7" rx="1.5" fill={brand} />
      <path d="M22 15h7v16a6 6 0 0 0 6 6h1v7h-2a12 12 0 0 1-12-12V15Z" fill={ink} />
    </svg>
  );
}

export function BrandMark({
  size = 28,
  showWordmark = true,
  onDark = false,
  className,
}: {
  size?: number;
  showWordmark?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className="grid shrink-0 place-items-center rounded-[10px]"
        style={{
          width: size,
          height: size,
          background: onDark ? "rgba(255,255,255,0.14)" : "var(--color-brand-soft)",
        }}
      >
        <BrandGlyph size={size * 0.66} onDark={onDark} />
      </span>
      {showWordmark && (
        <span className="text-[15px] font-bold tracking-tight" style={{ color: onDark ? "#fff" : "var(--color-fg)" }}>
          Field<span style={{ color: onDark ? "#F7B6D0" : "var(--color-brand)" }}>Ops</span>
        </span>
      )}
    </div>
  );
}
