import React from "react";
import Link from "next/link";

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  href?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      isLoading = false,
      fullWidth = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-200 select-none tap-target disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#C9962B] focus-visible:ring-offset-2 outline-none";

    const variantStyles = {
      primary: "bg-[#1F5A4B] text-[#F7F3E8] hover:bg-[#184739] shadow-sm",
      secondary: "border-2 border-[#1F5A4B] text-[#1F5A4B] bg-transparent hover:bg-[#EAF3F0]",
      ghost: "text-[#1F5A4B] hover:bg-[#EAF3F0] bg-transparent",
      danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
      gold: "bg-[#C9962B] text-[#0B231C] font-semibold hover:bg-[#A87A1E]",
    };

    const sizeStyles = {
      sm: "text-sm px-3.5 py-2 min-h-[40px]",
      md: "text-base px-5 py-2.5 min-h-[46px]",
      lg: "text-lg px-7 py-3.5 min-h-[52px]",
    };

    const widthStyle = fullWidth ? "w-full" : "";
    const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2.5 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </>
    );

    if (href && !disabled && !isLoading) {
      return (
        <Link href={href} className={combinedClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

AppButton.displayName = "AppButton";
