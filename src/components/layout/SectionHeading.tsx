import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignment} mb-6 sm:mb-8 ${className}`}>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1F5A4B] tracking-tight">
        {title}
      </h2>
      <div className="w-16 h-1 bg-[#C9962B] mt-2 mb-3 rounded-full" />
      {subtitle && (
        <p className="text-sm sm:text-base text-[#3C4A45] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
