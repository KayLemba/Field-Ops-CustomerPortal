"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/context";
import type {
  AuthUser,
  IssueCategory,
  IssueDetail,
  IssueListItem,
  IssueSeverity,
  IssueStatus,
} from "@/lib/types";

interface Opts extends Omit<RequestInit, "body"> {
  body?: unknown;
  form?: FormData;
}

/** Token-bound fetcher; a 401 anywhere logs the customer out. */
export function useApi() {
  const { token, logout } = useAuth();
  return useCallback(
    async <T,>(path: string, opts: Opts = {}): Promise<T> => {
      try {
        return await apiFetch<T>(path, { ...opts, token });
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) logout();
        throw e;
      }
    },
    [token, logout],
  );
}

function qs(params: Record<string, string | number | boolean | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") usp.set(k, String(v));
  const s = usp.toString();
  return s ? `?${s}` : "";
}

// ── Account ──────────────────────────────────────────────────────────────────
export function useChangePassword() {
  const api = useApi();
  return useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      api<{ ok: boolean }>("/api/auth/change-password", { method: "POST", body }),
  });
}

// ── Issues (reports) ─────────────────────────────────────────────────────────
export function useIssues(filters: { status?: IssueStatus; severity?: IssueSeverity } = {}) {
  const api = useApi();
  const { token } = useAuth();
  return useQuery({
    queryKey: ["issues", filters],
    queryFn: () =>
      api<{ issues: IssueListItem[] }>(
        `/api/issues${qs({ status: filters.status, severity: filters.severity })}`,
      ),
    select: (data) => data.issues,
    enabled: !!token,
  });
}

export function useIssue(id: string | undefined) {
  const api = useApi();
  return useQuery({
    queryKey: ["issue", id],
    queryFn: () => api<{ issue: IssueDetail }>(`/api/issues/${id}`),
    select: (data) => data.issue,
    enabled: !!id,
  });
}

interface CreateIssueInput {
  title: string;
  description?: string;
  category?: IssueCategory;
  severity?: IssueSeverity;
  photos?: File[];
  files?: File[];
}

export function useCreateIssue() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateIssueInput) => {
      const fd = new FormData();
      fd.set("title", input.title);
      if (input.description) fd.set("description", input.description);
      if (input.category) fd.set("category", input.category);
      if (input.severity) fd.set("severity", input.severity);
      for (const f of input.photos ?? []) fd.append("photos", f);
      for (const f of input.files ?? []) fd.append("files", f);
      return api<{ issue: IssueDetail }>("/api/issues", { method: "POST", form: fd });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

// ── Station managers (customer-side users) ────────────────────────────────────
export function useStationManagers() {
  const api = useApi();
  const { token, isAdmin } = useAuth();
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api<{ users: AuthUser[] }>("/api/users"),
    enabled: !!token && isAdmin,
  });
}

export function useCreateStationManager() {
  const api = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { fullName: string; email: string; password: string }) =>
      api<{ user: AuthUser }>("/api/users", { method: "POST", body: { ...input, role: "CUSTOMER" } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
