import React from "react";

export interface TextInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const TextInputField = React.forwardRef<HTMLInputElement, TextInputFieldProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3.5 py-2.5 rounded-[10px] border bg-white text-[#3C4A45] placeholder:text-[#3C4A45]/40 text-base min-h-[46px] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962B] focus-visible:ring-offset-1 outline-none ${
          error
            ? "border-[#DC2626] bg-[#FEF2F2]/50"
            : "border-[#CFE3DC] hover:border-[#A2C8BB] focus:border-[#1F5A4B]"
        } ${className}`}
        {...props}
      />
    );
  }
);

TextInputField.displayName = "TextInputField";
