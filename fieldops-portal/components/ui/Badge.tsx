import type { ReactNode } from "react";
import { Circle, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IssueSeverity, IssueStatus } from "@/lib/types";

export function Badge({
  children,
  color,
  soft,
  dot,
  className,
}: {
  children: ReactNode;
  /** Text/dot color (CSS value). */
  color?: string;
  /** Optional background tint (CSS value). */
  soft?: string;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        className,
      )}
      style={{
        color: color ?? "var(--color-fg-muted)",
        background: soft ?? "var(--color-surface-2)",
      }}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color ?? "currentColor" }} />}
      {children}
    </span>
  );
}

const statusColor: Record<IssueStatus, string> = {
  OPEN: "var(--color-blue)",
  ACKNOWLEDGED: "var(--color-amber)",
  IN_PROGRESS: "var(--color-brand)",
  RESOLVED: "#059669",
  CLOSED: "var(--color-fg-muted)",
  CANCELLED: "var(--color-danger)",
};

const statusLabels: Record<IssueStatus, string> = {
  OPEN: "Open",
  ACKNOWLEDGED: "Acknowledged",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

const statusIcons: Record<IssueStatus, React.ComponentType<{ className?: string }>> = {
  OPEN: Circle,
  ACKNOWLEDGED: Clock,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle2,
  CLOSED: CheckCircle2,
  CANCELLED: XCircle,
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  const Icon = statusIcons[status];
  return (
    <Badge color={statusColor[status]} soft={`color-mix(in oklab, ${statusColor[status]} 15%, transparent)`}>
      <Icon className="h-3 w-3" />
      {statusLabels[status]}
    </Badge>
  );
}

const severityColor: Record<IssueSeverity, string> = {
  LOW: "#059669",
  MEDIUM: "var(--color-amber)",
  HIGH: "#ea580c",
  CRITICAL: "var(--color-danger)",
};

export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  return (
    <Badge color={severityColor[severity]} soft={`color-mix(in oklab, ${severityColor[severity]} 15%, transparent)`}>
      {severity === "CRITICAL" && <AlertTriangle className="h-3 w-3" />}
      {severity === "CRITICAL" ? "Critical" : severity.charAt(0) + severity.slice(1).toLowerCase()}
    </Badge>
  );
}
