"use client";

import { MOOD_OPTIONS, type MoodType } from "@/lib/types";

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export default function MoodSelector({
  selectedMood,
  onSelect,
}: MoodSelectorProps) {
  const moods = Object.entries(MOOD_OPTIONS) as [MoodType, typeof MOOD_OPTIONS[MoodType]][];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
      {moods.map(([moodType, { emoji, label, color }]) => (
        <button
          key={moodType}
          onClick={() => onSelect(moodType)}
          className={`
            flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl
            transition-all active:animate-buttonPress
            ${
              selectedMood === moodType
                ? "scale-105 shadow-lg ring-2"
                : "hover:scale-105 shadow-md hover:shadow-lg"
            }
          `}
          style={{
            backgroundColor: selectedMood === moodType ? color : "var(--card-background)",
            borderColor: selectedMood === moodType ? color : "var(--card-border)",
            borderWidth: "1px",
            borderStyle: "solid",
            transition: "all var(--transition-base)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          } as React.CSSProperties}
        >
          <span className="text-3xl sm:text-4xl mb-1 sm:mb-2">{emoji}</span>
          <span
            className={`text-xs sm:text-sm font-medium ${
              selectedMood === moodType ? "text-white" : ""
            }`}
            style={{
              color: selectedMood === moodType ? "#ffffff" : "var(--foreground)",
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
