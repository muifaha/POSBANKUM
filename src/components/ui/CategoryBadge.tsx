import React from "react";
import { ShieldAlert } from "lucide-react";

interface CategoryBadgeProps {
  name: string;
  isSpecial?: boolean;
  className?: string;
}

export function CategoryBadge({ name, isSpecial = false, className = "" }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-medium border ${
        isSpecial
          ? "bg-[#FBF4E2] text-[#865F17] border-[#EBCF8A]"
          : "bg-[#EAF3F0] text-[#184739] border-[#CFE3DC]"
      } ${className}`}
    >
      {isSpecial && (
        <span title="Penanganan Khusus (PPA)" className="inline-flex">
          <ShieldAlert className="w-3.5 h-3.5 text-[#C9962B] shrink-0" />
        </span>
      )}
      <span>{name}</span>
    </span>
  );
}
