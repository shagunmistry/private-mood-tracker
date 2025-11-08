"use client";

import { MOOD_OPTIONS, type MoodEntry } from "@/lib/types";
import { deleteMoodEntry } from "@/lib/storage";
import { useState } from "react";

interface MoodListProps {
  entries: MoodEntry[];
  onUpdate: () => void;
}

export default function MoodList({ entries, onUpdate }: MoodListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    setDeletingId(id);
    try {
      await deleteMoodEntry(id);
      onUpdate();
    } catch (error) {
      console.error("Failed to delete entry:", error);
      alert("Failed to delete entry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      }) + ` at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: "var(--foreground-secondary)" }}>
        <div className="text-5xl mb-4">📖</div>
        <p className="text-base sm:text-lg font-medium mb-2" style={{ color: "var(--foreground)" }}>
          No mood entries yet
        </p>
        <p className="text-sm">Start tracking your mood to see your history!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: "var(--foreground)" }}>
        Your Mood History
      </h3>
      <div className="space-y-3">
        {entries.map((entry) => {
          const moodData = MOOD_OPTIONS[entry.mood];
          return (
            <div
              key={entry.id}
              className="glass-card rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <span className="text-3xl sm:text-4xl flex-shrink-0">{moodData.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-semibold text-base sm:text-lg"
                        style={{ color: moodData.color }}
                      >
                        {moodData.label}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm mb-2" style={{ color: "var(--foreground-secondary)" }}>
                      {formatDate(entry.timestamp)}
                    </p>
                    {entry.note && (
                      <p className="text-sm leading-relaxed break-words" style={{ color: "var(--foreground)" }}>
                        {entry.note}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className="p-2 rounded-xl transition-all flex-shrink-0 active:animate-buttonPress"
                  style={{
                    color: "#ff3b30",
                    backgroundColor: deletingId === entry.id ? "rgba(255, 59, 48, 0.1)" : "transparent",
                  }}
                  aria-label="Delete entry"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 59, 48, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    if (deletingId !== entry.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {deletingId === entry.id ? (
                    <span className="text-sm">...</span>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
