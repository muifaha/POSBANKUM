import React from "react";
import { MessageSquare } from "lucide-react";

export interface PhoneFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const PhoneField = React.forwardRef<HTMLInputElement, PhoneFieldProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center gap-1.5 text-[#1F5A4B] pointer-events-none">
          <MessageSquare className="w-4 h-4 text-[#25D366]" />
          <span className="text-sm font-semibold border-r border-[#CFE3DC] pr-2">
            +62
          </span>
        </div>
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          placeholder="812-3456-7890"
          className={`w-full pl-20 pr-3.5 py-2.5 rounded-[10px] border bg-white text-[#3C4A45] placeholder:text-[#3C4A45]/40 text-base min-h-[46px] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962B] focus-visible:ring-offset-1 outline-none ${
            error
              ? "border-[#DC2626] bg-[#FEF2F2]/50"
              : "border-[#CFE3DC] hover:border-[#A2C8BB] focus:border-[#1F5A4B]"
          } ${className}`}
          {...props}
        />
      </div>
    );
  }
);

PhoneField.displayName = "PhoneField";
