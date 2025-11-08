"use client";

import { useState } from "react";
import MoodSelector from "./MoodSelector";
import MoodEntryModal from "./MoodEntryModal";
import type { MoodType } from "@/lib/types";

interface AddMoodEntryProps {
  onAdded: () => void;
}

export default function AddMoodEntry({ onAdded }: AddMoodEntryProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMood(null);
  };

  const handleEntrySaved = () => {
    onAdded();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          How are you feeling?
        </h2>
        <MoodSelector selectedMood={null} onSelect={handleMoodSelect} />
      </div>

      {isModalOpen && selectedMood && (
        <MoodEntryModal
          mood={selectedMood}
          onClose={handleModalClose}
          onSaved={handleEntrySaved}
        />
      )}
    </div>
  );
}
