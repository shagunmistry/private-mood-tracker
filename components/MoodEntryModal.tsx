"use client";

import { useState } from "react";
import { MOOD_OPTIONS, type MoodType } from "@/lib/types";
import { createMoodEntry } from "@/lib/storage";

interface MoodEntryModalProps {
  mood: MoodType;
  onClose: () => void;
  onSaved: () => void;
}

export default function MoodEntryModal({
  mood,
  onClose,
  onSaved,
}: MoodEntryModalProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodData = MOOD_OPTIONS[mood];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createMoodEntry({
        mood,
        note: note.trim() || undefined,
      });
      onSaved();
      onClose();
    } catch (error) {
      console.error("Failed to save mood entry:", error);
      alert("Failed to save mood entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fadeIn"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="glass-card rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 transform transition-all animate-slideUp sm:animate-scaleIn safe-area-inset-bottom"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drag indicator for mobile */}
          <div className="flex justify-center sm:hidden -mt-2 mb-2">
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: "var(--card-border)" }}
            ></div>
          </div>

          {/* Header with selected mood */}
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{
                backgroundColor: moodData.color + "20",
                border: `2px solid ${moodData.color}`,
              }}
            >
              <span className="text-5xl">{moodData.emoji}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
              Feeling {moodData.label}
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
              Add a note about your mood (optional)
            </p>
          </div>

          {/* Note textarea */}
          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              autoFocus
              className="w-full px-4 py-3 rounded-2xl resize-none transition-all"
              style={{
                border: "1px solid var(--card-border)",
                backgroundColor: "var(--background-secondary)",
                color: "var(--foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-primary)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 122, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--card-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
              maxLength={500}
            />
            <div className="text-right text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
              {note.length}/500
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-2xl font-semibold transition-all active:animate-buttonPress disabled:opacity-50"
              style={{
                border: "1px solid var(--card-border)",
                backgroundColor: "var(--background-secondary)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-2xl font-semibold text-white transition-all hover:opacity-90 active:animate-buttonPress disabled:opacity-50 shadow-md"
              style={{
                backgroundColor: moodData.color,
              }}
            >
              {isSubmitting ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
