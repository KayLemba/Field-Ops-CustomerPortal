"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronsLeft, ChevronsRight, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useTheme } from "@/lib/theme/context";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/BrandMark";
import { Avatar } from "@/components/ui/Avatar";

const COLLAPSE_KEY = "fieldops-portal.sidebar-collapsed";

function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return { collapsed, toggle };
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}

/** Desktop, fixed-left, collapsible. Hidden on small screens (mobile uses BottomNav instead). */
function DesktopSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  return (
    <aside
      className="sidebar-shell fixed inset-y-0 left-0 z-20 hidden flex-col border-r md:flex"
      style={{
        width: collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w-expanded)",
        background: "var(--color-sidebar-bg)",
        borderColor: "var(--color-sidebar-border)",
      }}
    >
      <div className={cn("flex items-center px-5 py-5", collapsed && "justify-center px-0")}>
        <BrandMark size={30} showWordmark={!collapsed} onDark />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "bg-[var(--color-sidebar-bg-active)] text-[var(--color-sidebar-fg-active)]"
                  : "text-[var(--color-sidebar-fg)] hover:bg-[var(--color-sidebar-bg-hover)] hover:text-[var(--color-sidebar-fg-active)]"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t px-3 py-3" style={{ borderColor: "var(--color-sidebar-border)" }}>
        <button
          onClick={logout}
          title="Log out"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-sidebar-fg)] transition-colors hover:bg-[var(--color-sidebar-bg-hover)] hover:text-[var(--color-sidebar-fg-active)]",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={onToggle}
          title={collapsed ? "Expand" : "Collapse"}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-sidebar-fg)] transition-colors hover:bg-[var(--color-sidebar-bg-hover)] hover:text-[var(--color-sidebar-fg-active)]",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="h-[18px] w-[18px] shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function TopBar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="flex items-center justify-end gap-2 px-4 py-3 md:px-8">
        <button
          aria-label="Notifications"
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <ThemeToggle />
        <div className="ml-1 hidden text-right leading-tight sm:block">
          <div className="text-sm font-semibold text-[var(--color-fg)]">{user.fullName}</div>
          <div className="text-xs text-[var(--color-fg-muted)]">
            {user.role === "CUSTOMER_ADMIN" ? "Admin" : "Field Technician"}
          </div>
        </div>
        <Avatar name={user.fullName} size={34} />
      </div>
    </header>
  );
}

/** Mobile, fixed-bottom, WhatsApp-style icon tabs. Hidden on md+ (desktop uses the sidebar instead). */
function MobileBottomNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  const items = [...NAV_ITEMS, { href: "__logout__", label: "Logout", icon: LogOut }];

  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-20 flex border-t md:hidden"
      style={{
        height: "var(--bottom-nav-h)",
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {items.map((item) => {
        const isLogout = item.href === "__logout__";
        const active = !isLogout && (pathname === item.href || pathname?.startsWith(item.href + "/"));
        const Icon = item.icon;
        const content = (
          <>
            <Icon className={cn("h-5 w-5", active ? "text-[var(--color-brand)]" : "text-[var(--color-fg-muted)]")} />
            <span
              className={cn(
                "text-[11px] font-medium",
                active ? "text-[var(--color-brand)]" : "text-[var(--color-fg-muted)]"
              )}
            >
              {item.label}
            </span>
          </>
        );
        if (isLogout) {
          return (
            <button key={item.href} onClick={logout} className="flex flex-1 flex-col items-center justify-center gap-1">
              {content}
            </button>
          );
        }
        return (
          <Link key={item.href} href={item.href} className="flex flex-1 flex-col items-center justify-center gap-1">
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <DesktopSidebar collapsed={collapsed} onToggle={toggle} />
      <div
        className="content-shell flex min-h-screen flex-col"
        style={{ "--content-ml": collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w-expanded)" } as React.CSSProperties}
      >
        <TopBar />
        <main className="bottom-nav-safe mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:pb-10">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
