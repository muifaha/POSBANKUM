import React from "react";
import { AlertCircle, AlertTriangle, Info, PhoneCall, CheckCircle } from "lucide-react";

interface InfoCalloutProps {
  type?: "info" | "warning" | "emergency" | "success";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoCallout({
  type = "info",
  title,
  children,
  className = "",
}: InfoCalloutProps) {
  const styles = {
    info: {
      container: "bg-[#F7F3E8] border-[#EBCF8A] text-[#3C4A45]",
      icon: <Info className="w-5 h-5 text-[#C9962B] shrink-0 mt-0.5" />,
      titleColor: "text-[#184739]",
    },
    warning: {
      container: "bg-[#FEF9C3] border-[#FDE047] text-[#713F12]",
      icon: <AlertTriangle className="w-5 h-5 text-[#CA8A04] shrink-0 mt-0.5" />,
      titleColor: "text-[#854D0E]",
    },
    emergency: {
      container: "bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B]",
      icon: <PhoneCall className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />,
      titleColor: "text-[#991B1B]",
    },
    success: {
      container: "bg-[#EAF3F0] border-[#A2C8BB] text-[#12352B]",
      icon: <CheckCircle className="w-5 h-5 text-[#1F5A4B] shrink-0 mt-0.5" />,
      titleColor: "text-[#12352B]",
    },
  };

  const current = styles[type];

  return (
    <div
      role="region"
      aria-label={title || type}
      className={`rounded-[12px] border p-4 sm:p-5 flex items-start gap-3.5 ${current.container} ${className}`}
    >
      {current.icon}
      <div className="text-sm sm:text-base leading-relaxed flex-1">
        {title && <h4 className={`font-semibold mb-1 ${current.titleColor}`}>{title}</h4>}
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}
