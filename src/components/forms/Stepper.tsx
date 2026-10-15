import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

export function Stepper({ currentStep, className = "" }: StepperProps) {
  const steps = [
    { step: 1, label: "Identitas Pelapor" },
    { step: 2, label: "Detail Laporan" },
    { step: 3, label: "Tiket & Selesai" },
  ];

  return (
    <div className={`w-full py-4 ${className}`} aria-label="Tahapan formulir">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-[#CFE3DC] -z-0" />
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-[#1F5A4B] transition-all duration-300 -z-0"
          style={{
            width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
          }}
        />

        {steps.map((s) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <div
              key={s.step}
              className="flex flex-col items-center relative z-10 bg-[#FAFAF8] px-2"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs ${
                  isCompleted
                    ? "bg-[#1F5A4B] text-[#F7F3E8]"
                    : isCurrent
                    ? "bg-[#C9962B] text-[#0B231C] ring-4 ring-[#F5E4B8]"
                    : "bg-white border-2 border-[#CFE3DC] text-[#3C4A45]/60"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium text-center ${
                  isCurrent ? "text-[#1F5A4B] font-bold" : "text-[#3C4A45]/70"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
