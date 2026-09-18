import { ClipboardPlus, ClipboardList, KeyRound, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** The four primary destinations. Logout is rendered separately since it's an action, not a route. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/report", label: "Report", icon: ClipboardPlus },
  { href: "/reports", label: "My Reports", icon: ClipboardList },
  { href: "/change-password", label: "Password", icon: KeyRound },
];
