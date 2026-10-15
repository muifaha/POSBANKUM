import React from "react";

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options?: { value: string; label: string; isSpecial?: boolean }[];
  children?: React.ReactNode;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className = "", error, options, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`w-full px-3.5 py-2.5 rounded-[10px] border bg-white text-[#3C4A45] text-base min-h-[46px] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962B] focus-visible:ring-offset-1 outline-none appearance-none pr-10 cursor-pointer ${
            error
              ? "border-[#DC2626] bg-[#FEF2F2]/50"
              : "border-[#CFE3DC] hover:border-[#A2C8BB] focus:border-[#1F5A4B]"
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.isSpecial ? `🛡️ ${opt.label}` : opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1F5A4B]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
