"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Inbox, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge, SeverityBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState, ErrorState, ShimmerRows } from "@/components/ui/States";
import { useIssues } from "@/lib/hooks/api";
import { cn } from "@/lib/utils";
import type { IssueStatus } from "@/lib/types";

const filters: { value: IssueStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "ACKNOWLEDGED", label: "Acknowledged" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const categoryLabels: Record<string, string> = {
  SOFTWARE: "Software",
  HARDWARE: "Hardware",
  CCTV: "CCTV",
  OTHER: "Other",
};

export default function ReportsPage() {
  const [status, setStatus] = useState<IssueStatus | "ALL">("ALL");
  const { data: issues, isLoading, isError, refetch } = useIssues(
    status === "ALL" ? {} : { status }
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const issue of issues ?? []) c[issue.status] = (c[issue.status] ?? 0) + 1;
    return c;
  }, [issues]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-fg)" }}>
          My Reports
        </h1>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Issues you've reported and their status.</p>
      </div>

      <div className="mb-5 flex gap-1.5 overflow-x-auto rounded-xl bg-[var(--color-surface-2)] p-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={cn(
              "whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              status === f.value
                ? "bg-[var(--color-surface)] text-[var(--color-fg)] shadow-sm"
                : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            )}
          >
            {f.label}
            {f.value !== "ALL" && counts[f.value] ? (
              <span className="ml-1.5 text-xs text-[var(--color-fg-subtle)]">{counts[f.value]}</span>
            ) : null}
          </button>
        ))}
      </div>

      {isLoading && <ShimmerRows count={4} />}
      {isError && <ErrorState message="Couldn't load reports." onRetry={() => refetch()} />}
      {!isLoading && !isError && issues?.length === 0 && (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title="No reports yet"
          description="Reports you submit will show up here."
        />
      )}

      <div className="flex flex-col gap-3">
        {issues?.map((issue) => (
          <Link key={issue.id} href={`/reports/${issue.id}`}>
            <Card className="transition-colors hover:border-[var(--color-brand)]">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={issue.status} />
                    {issue.severity === "CRITICAL" && <SeverityBadge severity={issue.severity} />}
                  </div>
                  <Avatar name={issue.reportedBy.fullName} size={30} />
                </div>

                <h3 className="mt-2.5 text-[15px] font-semibold" style={{ color: "var(--color-fg)" }}>
                  {issue.title}
                </h3>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-fg-muted)]">
                  <span className="font-medium" style={{ color: "var(--color-brand)" }}>
                    {categoryLabels[issue.category] ?? issue.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                  {issue._count.attachments > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Paperclip className="h-3.5 w-3.5" />
                      {issue._count.attachments}
                    </span>
                  )}
                  <span>{issue.site.name}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
