import { CURRENCY } from "../config";

export function formatCurrency(amount: number): string {
  return `${CURRENCY}${amount.toLocaleString()}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
    case "completed":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "rejected":
    case "cancelled":
    case "failed":
      return "text-red-500";
    case "expired":
      return "text-gray-500";
    default:
      return "text-foreground";
  }
}

export function getDaysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
