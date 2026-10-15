import React from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  charCount?: { current: number; max: number };
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  charCount,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="block text-sm sm:text-base font-semibold text-[#184739]"
        >
          {label} {required && <span className="text-[#DC2626] font-bold" aria-hidden="true">*</span>}
        </label>
        {charCount && (
          <span className="text-xs text-[#3C4A45]/70">
            {charCount.current} / {charCount.max}
          </span>
        )}
      </div>

      {children}

      {hint && !error && (
        <p className="text-xs sm:text-sm text-[#3C4A45]/80 leading-normal">{hint}</p>
      )}

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="text-xs sm:text-sm font-medium text-[#DC2626] flex items-center gap-1"
        >
          {error}
        </p>
      )}
    </div>
  );
}
