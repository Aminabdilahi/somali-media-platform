export type Role = "admin" | "editor" | "researcher" | "reviewer" | "viewer";
export interface User { id: string; org_id: string; email: string; full_name: string; role: Role; is_active: boolean }
export type TaskStatus = "PENDING" | "RUNNING" | "WAITING_FOR_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED" | "FAILED" | "CANCELLED";
export interface Task { id: string; agent: string; status: TaskStatus; progress: number; error: string | null; created_at: string; updated_at: string }
export interface Agent { key: string; name: string; description: string; phase: number; available: boolean; running_tasks: number }
export interface Setting { key: string; is_secret: boolean; value: string | null; is_set: boolean }

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch { /* non-JSON error body */ }
    throw new ApiError(res.status, detail);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
const post = <T,>(p: string, body?: unknown) => request<T>(p, { method: "POST", body: body ? JSON.stringify(body) : undefined });

export const api = {
  status: () => request<{ bootstrapped: boolean }>("/auth/status"),
  bootstrap: (b: { org_name: string; full_name: string; email: string; password: string }) => post<User>("/auth/bootstrap", b),
  login: (email: string, password: string) => post<User>("/auth/login", { email, password }),
  logout: () => post<void>("/auth/logout"),
  me: () => request<User>("/auth/me"),
  agents: () => request<Agent[]>("/agents"),
  tasks: (limit = 50) => request<Task[]>(`/agents/tasks?limit=${limit}`),
  taskSummary: () => request<Record<TaskStatus, number>>("/agents/tasks/summary"),
  cancelTask: (id: string) => post<Task>(`/agents/tasks/${id}/cancel`),
  settings: () => request<Setting[]>("/settings"),
  putSetting: (key: string, value: string) => request<Setting>(`/settings/${key}`, { method: "PUT", body: JSON.stringify({ value }) }),
  testLlm: () => post<{ provider: string; model: string; reply: string }>("/agents/llm/test"),
};
