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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <h2 className="text-2xl font-semibold text-gray-800">
              Feeling {moodData.label}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
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
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                       transition-colors resize-none text-gray-800"
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {note.length}/500
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300
                       text-gray-700 font-semibold hover:bg-gray-50
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white
                       transition-all duration-200 transform hover:scale-[1.02]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:transform-none shadow-lg"
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
