"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/BrandMark";
import { Avatar } from "@/components/ui/Avatar";

const links = [
  { href: "/report", label: "Report" },
  { href: "/reports", label: "My Reports" },
  { href: "/managers", label: "Managers", adminOnly: true },
  { href: "/change-password", label: "Password" },
];

export function Nav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <BrandMark size={28} />
        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <div className="text-sm font-semibold text-[var(--color-fg)]">
              {user.managedSite?.name ?? "FieldOps"}
            </div>
            <div className="text-xs text-[var(--color-fg-muted)]">{user.fullName}</div>
          </div>
          <Avatar name={user.fullName} size={30} />
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
      <nav className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 pb-2">
        {links
          .filter((l) => !l.adminOnly || user.role === "CUSTOMER_ADMIN")
          .map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--color-brand)] text-white"
                    : "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-2)]"
                )}
              >
                {l.label}
              </Link>
            );
          })}
      </nav>
    </header>
  );
}
