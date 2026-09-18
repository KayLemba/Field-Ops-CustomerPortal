export type Role = "CUSTOMER" | "CUSTOMER_ADMIN";

export type IssueStatus =
  | "OPEN"
  | "ACKNOWLEDGED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IssueCategory = "SOFTWARE" | "HARDWARE" | "CCTV" | "OTHER";

export interface Site {
  id: string;
  name: string;
}

export interface UserSummary {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  role: Role;
  disciplines: string[];
  teamId?: string | null;
  managedSiteId?: string | null;
  managedSite?: Site;
}

/** Alias matching fieldops-web's naming for the authenticated-user shape. */
export type AuthUser = UserSummary;

export interface AuthResponse {
  token: string;
  user: UserSummary;
}

export interface Attachment {
  id: string;
  kind: "photo" | "file";
  url: string;
  name: string;
}

export interface IssueListItem {
  id: string;
  title: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  site: Site;
  reportedBy: { id: string; fullName: string };
  _count: { attachments: number };
  createdAt: string;
}

export interface IssueEvent {
  id: string;
  status: IssueStatus;
  note?: string | null;
  at: string;
  by: { id: string; fullName: string };
}

export interface IssueDetail {
  id: string;
  title: string;
  description?: string | null;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  site: Site;
  reportedBy: { id: string; fullName: string };
  attachments: Attachment[];
  events: IssueEvent[];
  task?: { id: string; title: string; status: string } | null;
}

/** Shape of an error payload returned by the API (not the thrown ApiError class in lib/api/client.ts). */
export interface ApiErrorShape {
  error: string;
  details?: unknown;
}
