import React from "react";

export interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ className = "", error, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-3.5 py-2.5 rounded-[10px] border bg-white text-[#3C4A45] placeholder:text-[#3C4A45]/40 text-base leading-relaxed transition-colors focus-visible:ring-2 focus-visible:ring-[#C9962B] focus-visible:ring-offset-1 outline-none resize-y ${
          error
            ? "border-[#DC2626] bg-[#FEF2F2]/50"
            : "border-[#CFE3DC] hover:border-[#A2C8BB] focus:border-[#1F5A4B]"
        } ${className}`}
        {...props}
      />
    );
  }
);

TextAreaField.displayName = "TextAreaField";
