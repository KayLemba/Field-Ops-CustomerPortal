"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Paperclip } from "lucide-react";
import { PageHeader, Card, CardContent } from "@/components/ui/Card";
import { StatusBadge, SeverityBadge } from "@/components/ui/Badge";
import { AuthedImage, AuthedFileLink } from "@/components/ui/Media";
import { LoadingBlock, ErrorState } from "@/components/ui/States";
import { useIssue } from "@/lib/hooks/api";

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: issue, isLoading, isError, refetch } = useIssue(id);

  if (isLoading) {
    return <LoadingBlock />;
  }
  if (isError || !issue) {
    return <ErrorState message="Couldn't load this report." onRetry={() => refetch()} />;
  }

  return (
    <div>
      <Link
        href="/reports"
        className="mb-3 inline-flex items-center gap-1 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      >
        <ArrowLeft className="h-4 w-4" />
        My Reports
      </Link>
      <PageHeader
        title={issue.title}
        subtitle={`${issue.site.name} · reported by ${issue.reportedBy.fullName}`}
        action={
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={issue.status} />
            <SeverityBadge severity={issue.severity} />
          </div>
        }
      />

      {issue.description && (
        <Card className="mb-4">
          <CardContent>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">
              Description
            </h3>
            <p className="text-sm text-[var(--color-fg)]">{issue.description}</p>
          </CardContent>
        </Card>
      )}

      {issue.attachments.length > 0 && (
        <Card className="mb-4">
          <CardContent>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">
              <Paperclip className="h-3.5 w-3.5" />
              Attachments
            </h3>
            <div className="flex flex-wrap gap-2">
              {issue.attachments.map((a) =>
                a.kind === "photo" ? (
                  <AuthedImage key={a.id} src={a.url} alt={a.name} />
                ) : (
                  <AuthedFileLink key={a.id} src={a.url} name={a.name} />
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">
            Timeline
          </h3>
          <ol className="flex flex-col gap-4">
            {issue.events.map((event, i) => (
              <li key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand)]" />
                  {i < issue.events.length - 1 && <span className="w-px flex-1 bg-[var(--color-border)]" />}
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={event.status} />
                    <span className="text-xs text-[var(--color-fg-muted)]">
                      {new Date(event.at).toLocaleString()}
                    </span>
                  </div>
                  {event.note && <p className="mt-1 text-sm text-[var(--color-fg)]">{event.note}</p>}
                  <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">{event.by.fullName}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
