"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, X, Users } from "lucide-react";
import { PageHeader, Card, CardContent } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState, ShimmerRows } from "@/components/ui/States";
import { useAuth } from "@/lib/auth/context";
import { useCreateStationManager, useStationManagers } from "@/lib/hooks/api";
import { ApiError } from "@/lib/api/client";

export default function ManagersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: managers, isLoading } = useStationManagers();
  const createManager = useCreateStationManager();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user && user.role !== "CUSTOMER_ADMIN") router.replace("/reports");
  }, [user, router]);

  if (!user || user.role !== "CUSTOMER_ADMIN") return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createManager.mutateAsync({ fullName, email, password });
      setFullName("");
      setEmail("");
      setPassword("");
      setShowForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add manager");
    }
  }

  return (
    <div>
      <PageHeader
        title="Station Managers"
        subtitle="Everyone with access to report and view issues for your site."
        action={
          <Button size="sm" variant="secondary" onClick={() => setShowForm((s) => !s)}>
            {showForm ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add manager"}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-4">
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Temporary password</Label>
                <Input id="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
              <Button type="submit" variant="brand" loading={createManager.isPending}>
                Add manager
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading && <ShimmerRows count={3} />}
      {!isLoading && managers?.length === 0 && (
        <EmptyState icon={<Users className="h-6 w-6" />} title="No managers yet" description="Add the people who can report and view issues for this site." />
      )}

      <div className="flex flex-col gap-2">
        {managers?.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex items-center gap-3">
              <Avatar name={m.fullName} size={32} />
              <div>
                <p className="text-sm font-medium text-[var(--color-fg)]">{m.fullName}</p>
                <p className="text-xs text-[var(--color-fg-muted)]">{m.email}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
