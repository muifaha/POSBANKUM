import React from "react";

interface ChoiceOption<T extends string> {
  value: T;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ChoiceCardProps<T extends string> {
  options: ChoiceOption<T>[];
  value: T;
  onChange: (val: T) => void;
  name: string;
  className?: string;
}

export function ChoiceCard<T extends string>({
  options,
  value,
  onChange,
  name,
  className = "",
}: ChoiceCardProps<T>) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className={`relative flex items-start gap-3.5 p-4 rounded-[12px] border-2 cursor-pointer transition-all ${
              isSelected
                ? "border-[#1F5A4B] bg-[#EAF3F0] shadow-xs"
                : "border-[#CFE3DC] bg-white hover:border-[#A2C8BB] hover:bg-[#F7F3E8]/50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="mt-1 h-4 w-4 text-[#1F5A4B] border-[#CFE3DC] focus:ring-[#C9962B]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {option.icon}
                <span className="font-semibold text-base text-[#184739]">
                  {option.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3C4A45]/80 mt-1 leading-normal">
                {option.description}
              </p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
