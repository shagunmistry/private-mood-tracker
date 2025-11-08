// Mood types with cute emoji representations
export type MoodType =
  | "amazing"
  | "happy"
  | "neutral"
  | "sad"
  | "anxious"
  | "angry";

export interface MoodEmoji {
  emoji: string;
  label: string;
  color: string;
}

export const MOOD_OPTIONS: Record<MoodType, MoodEmoji> = {
  amazing: { emoji: "🤩", label: "Amazing", color: "#fbbf24" },
  happy: { emoji: "😊", label: "Happy", color: "#34d399" },
  neutral: { emoji: "😐", label: "Neutral", color: "#94a3b8" },
  sad: { emoji: "😢", label: "Sad", color: "#60a5fa" },
  anxious: { emoji: "😰", label: "Anxious", color: "#a78bfa" },
  angry: { emoji: "😠", label: "Angry", color: "#f87171" },
};

// Mood entry interface
export interface MoodEntry {
  id: string;
  mood: MoodType;
  note?: string;
  timestamp: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create mood entry input (without auto-generated fields)
export interface CreateMoodEntry {
  mood: MoodType;
  note?: string;
}

// Storage backup types
export type BackupProvider = "google-drive" | "local" | "none";

export interface BackupSettings {
  provider: BackupProvider;
  autoBackup: boolean;
  lastBackup?: Date;
}

// Export formats
export type ExportFormat = "json" | "csv";
