import React from "react";
import { Clock } from "lucide-react";

interface DueIndicatorProps {
  dueDate: Date | string;
  isCompleted?: boolean;
  type?: "respons" | "penyelesaian";
}

export function DueIndicator({
  dueDate,
  isCompleted = false,
  type = "respons",
}: DueIndicatorProps) {
  if (isCompleted) {
    return null;
  }

  const target = new Date(dueDate).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  let status: "normal" | "warning" | "overdue" = "normal";
  let label = "";

  if (diffMs < 0) {
    status = "overdue";
    const lateHours = Math.abs(diffHours);
    label = `Lewat SLA ${lateHours > 24 ? `${Math.round(lateHours / 24)} hari` : `${lateHours} jam`}`;
  } else if (diffHours <= 6) {
    status = "warning";
    label = `Sisa ${diffHours} jam`;
  } else {
    status = "normal";
    const days = Math.round(diffHours / 24);
    label = `Sisa ${days > 0 ? `${days} hari` : `${diffHours} jam`}`;
  }

  const styles = {
    normal: "bg-[#EAF3F0] text-[#184739] border-[#CFE3DC]",
    warning: "bg-[#FBF4E2] text-[#865F17] border-[#EBCF8A]",
    overdue: "bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}
      title={`Batas waktu ${type}: ${new Date(dueDate).toLocaleString("id-ID")}`}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
