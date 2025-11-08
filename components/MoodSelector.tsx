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
    <div className="grid grid-cols-3 gap-4 mb-6">
      {moods.map(([moodType, { emoji, label, color }]) => (
        <button
          key={moodType}
          onClick={() => onSelect(moodType)}
          className={`
            flex flex-col items-center justify-center p-6 rounded-2xl
            transition-all duration-200 transform
            ${
              selectedMood === moodType
                ? "scale-105 shadow-lg"
                : "hover:scale-105 shadow-md hover:shadow-lg"
            }
          `}
          style={{
            backgroundColor: selectedMood === moodType ? color : "#f8fafc",
            borderColor: color,
            borderWidth: selectedMood === moodType ? "2px" : "1px",
            borderStyle: "solid",
          }}
        >
          <span className="text-4xl mb-2">{emoji}</span>
          <span
            className={`text-sm font-medium ${
              selectedMood === moodType ? "text-white" : "text-gray-700"
            }`}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
