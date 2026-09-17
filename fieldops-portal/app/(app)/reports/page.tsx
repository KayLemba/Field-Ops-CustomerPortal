"use client";

import { useState } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { PageHeader, Card, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import { StatusBadge, SeverityBadge } from "@/components/ui/Badge";
import { EmptyState, ErrorState, ShimmerRows } from "@/components/ui/States";
import { useIssues } from "@/lib/hooks/api";
import type { IssueStatus } from "@/lib/types";

const statusOptions: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "ACKNOWLEDGED", label: "Acknowledged" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function ReportsPage() {
  const [status, setStatus] = useState("");
  const { data: issues, isLoading, isError, refetch } = useIssues(
    status ? { status: status as IssueStatus } : {}
  );

  return (
    <div>
      <PageHeader
        title="My Reports"
        action={
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        }
      />

      {isLoading && <ShimmerRows count={4} />}
      {isError && <ErrorState message="Couldn't load reports." onRetry={() => refetch()} />}
      {!isLoading && !isError && issues?.length === 0 && (
        <EmptyState icon={<Inbox className="h-6 w-6" />} title="No reports yet" description="Reports you submit will show up here." />
      )}

      <div className="flex flex-col gap-3">
        {issues?.map((issue) => (
          <Link key={issue.id} href={`/reports/${issue.id}`}>
            <Card className="transition-colors hover:border-[var(--color-brand)]">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-fg)]">{issue.title}</h3>
                    <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                      {issue.site.name} · {issue.reportedBy.fullName} · {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={issue.status} />
                    <SeverityBadge severity={issue.severity} />
                  </div>
                </div>
                {issue._count.attachments > 0 && (
                  <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
                    {issue._count.attachments} attachment{issue._count.attachments > 1 ? "s" : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
