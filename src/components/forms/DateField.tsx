import React from "react";

export interface DateFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  ({ className = "", error, max, ...props }, ref) => {
    // Tanggal kejadian tidak boleh masa depan
    const today = new Date().toISOString().split("T")[0];

    return (
      <input
        ref={ref}
        type="date"
        max={max || today}
        className={`w-full px-3.5 py-2.5 rounded-[10px] border bg-white text-[#3C4A45] text-base min-h-[46px] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962B] focus-visible:ring-offset-1 outline-none ${
          error
            ? "border-[#DC2626] bg-[#FEF2F2]/50"
            : "border-[#CFE3DC] hover:border-[#A2C8BB] focus:border-[#1F5A4B]"
        } ${className}`}
        {...props}
      />
    );
  }
);

DateField.displayName = "DateField";
