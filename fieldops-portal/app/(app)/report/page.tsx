"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { PageHeader, Card, CardContent } from "@/components/ui/Card";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateIssue } from "@/lib/hooks/api";
import { ApiError } from "@/lib/api/client";
import type { IssueCategory, IssueSeverity } from "@/lib/types";

const categoryOptions: { value: IssueCategory; label: string }[] = [
  { value: "SOFTWARE", label: "Software" },
  { value: "HARDWARE", label: "Hardware" },
  { value: "CCTV", label: "CCTV" },
  { value: "OTHER", label: "Other" },
];

const severityOptions: { value: IssueSeverity; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export default function ReportPage() {
  const router = useRouter();
  const createIssue = useCreateIssue();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory>("OTHER");
  const [severity, setSeverity] = useState<IssueSeverity>("MEDIUM");
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  function onPhotosChange(e: ChangeEvent<HTMLInputElement>) {
    setPhotos(Array.from(e.target.files ?? []));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { issue } = await createIssue.mutateAsync({
        title,
        description: description || undefined,
        category,
        severity,
        photos,
      });
      router.push(`/reports/${issue.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit report");
    }
  }

  return (
    <div>
      <PageHeader title="Report a Problem" subtitle="Let us know what's going on at your site." />
      <Card>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Pump 3 tag reader not responding"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="What's happening, and since when?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                >
                  {categoryOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select
                  id="severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
                >
                  {severityOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-fg-muted)]">
                <Camera className="h-4 w-4" />
                Photos
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onPhotosChange}
                className="text-sm text-[var(--color-fg-muted)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-brand)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
              />
              {photos.length > 0 && (
                <span className="text-xs text-[var(--color-fg-muted)]">
                  {photos.length} photo{photos.length > 1 ? "s" : ""} selected
                </span>
              )}
            </div>
            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
            <Button type="submit" variant="brand" loading={createIssue.isPending} className="w-full">
              Submit report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
