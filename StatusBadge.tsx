import type { TaskStatus } from "@/lib/api";

const TONE: Record<TaskStatus, string> = {
  PENDING: "text-muted", RUNNING: "text-sea", WAITING_FOR_REVIEW: "text-amber", APPROVED: "text-ok",
  REJECTED: "text-alert", COMPLETED: "text-ok", FAILED: "text-alert", CANCELLED: "text-muted",
};
export const LABEL: Record<TaskStatus, string> = {
  PENDING: "Pending", RUNNING: "Running", WAITING_FOR_REVIEW: "Waiting for review", APPROVED: "Approved",
  REJECTED: "Rejected", COMPLETED: "Completed", FAILED: "Failed", CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`text-sm font-medium ${TONE[status]}`}>{LABEL[status]}</span>;
}
