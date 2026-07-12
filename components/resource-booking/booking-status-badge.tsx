import { cn } from "@/lib/utils";

type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";

const statusClasses: Record<BookingStatus, string> = {
  Confirmed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Cancelled: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  Completed: "border-slate-600 bg-slate-800 text-slate-300",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}