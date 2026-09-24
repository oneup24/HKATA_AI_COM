import { STATUS_LABEL, type Status } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: Status }) {
  return <span className={cn("status-pill", `status-${status}`)}>{STATUS_LABEL[status]}</span>;
}
