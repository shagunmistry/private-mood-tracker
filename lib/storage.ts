import type { MoodEntry, CreateMoodEntry } from "./types";

const DB_NAME = "MoodDiaryDB";
const DB_VERSION = 1;
const STORE_NAME = "moodEntries";

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
        // Create index for timestamp for efficient querying
        objectStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create a new mood entry
export async function createMoodEntry(
  data: CreateMoodEntry
): Promise<MoodEntry> {
  const db = await openDB();
  const now = new Date();

  const entry: MoodEntry = {
    id: generateId(),
    mood: data.mood,
    note: data.note,
    timestamp: now.getTime(),
    createdAt: now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(entry);

    request.onsuccess = () => resolve(entry);
    request.onerror = () => reject(request.error);
  });
}

// Get all mood entries
export async function getAllMoodEntries(): Promise<MoodEntry[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const entries = request.result.sort(
        (a, b) => b.timestamp - a.timestamp
      );
      resolve(entries);
    };
    request.onerror = () => reject(request.error);
  });
}

// Get mood entry by ID
export async function getMoodEntry(id: string): Promise<MoodEntry | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// Update mood entry
export async function updateMoodEntry(
  id: string,
  data: Partial<CreateMoodEntry>
): Promise<MoodEntry> {
  const db = await openDB();
  const existing = await getMoodEntry(id);

  if (!existing) {
    throw new Error("Mood entry not found");
  }

  const updated: MoodEntry = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(updated);

    request.onsuccess = () => resolve(updated);
    request.onerror = () => reject(request.error);
  });
}

// Delete mood entry
export async function deleteMoodEntry(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Get entries by date range
export async function getMoodEntriesByDateRange(
  startDate: Date,
  endDate: Date
): Promise<MoodEntry[]> {
  const db = await openDB();
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("timestamp");
    const range = IDBKeyRange.bound(startTimestamp, endTimestamp);
    const request = index.getAll(range);

    request.onsuccess = () => {
      const entries = request.result.sort(
        (a, b) => b.timestamp - a.timestamp
      );
      resolve(entries);
    };
    request.onerror = () => reject(request.error);
  });
}

// Export all data
export async function exportAllData(): Promise<MoodEntry[]> {
  return await getAllMoodEntries();
}

// Import data (overwrites existing)
export async function importData(entries: MoodEntry[]): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing data
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      // Add all imported entries
      entries.forEach((entry) => {
        store.add(entry);
      });
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Clear all data
export async function clearAllData(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Analytics and Statistics Functions

export interface MoodStatistics {
  totalEntries: number;
  moodCounts: Record<string, number>;
  moodPercentages: Record<string, number>;
  averageMoodScore: number;
  mostCommonMood: string;
  currentStreak: number;
  longestStreak: number;
}

export interface MoodTrend {
  date: string;
  moodCounts: Record<string, number>;
  averageScore: number;
}

// Calculate mood statistics
export async function getMoodStatistics(): Promise<MoodStatistics> {
  const entries = await getAllMoodEntries();
  const totalEntries = entries.length;

  if (totalEntries === 0) {
    return {
      totalEntries: 0,
      moodCounts: {},
      moodPercentages: {},
      averageMoodScore: 0,
      mostCommonMood: "",
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  // Count moods
  const moodCounts: Record<string, number> = {};
  entries.forEach((entry) => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });

  // Calculate percentages
  const moodPercentages: Record<string, number> = {};
  Object.keys(moodCounts).forEach((mood) => {
    moodPercentages[mood] = (moodCounts[mood] / totalEntries) * 100;
  });

  // Find most common mood
  const mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
    moodCounts[a] > moodCounts[b] ? a : b
  );

  // Calculate average mood score (amazing=5, happy=4, neutral=3, sad=2, anxious=1, angry=0)
  const moodScores: Record<string, number> = {
    amazing: 5,
    happy: 4,
    neutral: 3,
    sad: 2,
    anxious: 1,
    angry: 0,
  };

  const totalScore = entries.reduce(
    (sum, entry) => sum + (moodScores[entry.mood] || 0),
    0
  );
  const averageMoodScore = totalScore / totalEntries;

  // Calculate streaks (consecutive days with entries)
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  let lastDate: Date | null = null;

  sortedEntries.forEach((entry) => {
    const entryDate = new Date(entry.timestamp);
    entryDate.setHours(0, 0, 0, 0);

    if (lastDate) {
      const dayDiff =
        (entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        tempStreak++;
      } else if (dayDiff > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    lastDate = entryDate;
  });

  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastEntryDate = new Date(sortedEntries[sortedEntries.length - 1].timestamp);
  lastEntryDate.setHours(0, 0, 0, 0);
  const daysSinceLastEntry =
    (today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceLastEntry <= 1) {
    currentStreak = tempStreak;
  }

  return {
    totalEntries,
    moodCounts,
    moodPercentages,
    averageMoodScore,
    mostCommonMood,
    currentStreak,
    longestStreak,
  };
}

// Get mood trends by day for the last N days
export async function getMoodTrends(days: number = 30): Promise<MoodTrend[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const entries = await getMoodEntriesByDateRange(startDate, endDate);

  // Group by date
  const trendMap: Record<string, MoodEntry[]> = {};

  entries.forEach((entry) => {
    const date = new Date(entry.timestamp);
    const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!trendMap[dateKey]) {
      trendMap[dateKey] = [];
    }
    trendMap[dateKey].push(entry);
  });

  // Convert to trend array
  const trends: MoodTrend[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const dateKey = date.toISOString().split("T")[0];

    const dayEntries = trendMap[dateKey] || [];

    // Count moods for this day
    const moodCounts: Record<string, number> = {};
    dayEntries.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    // Calculate average score for this day
    const moodScores: Record<string, number> = {
      amazing: 5,
      happy: 4,
      neutral: 3,
      sad: 2,
      anxious: 1,
      angry: 0,
    };

    const totalScore = dayEntries.reduce(
      (sum, entry) => sum + (moodScores[entry.mood] || 0),
      0
    );
    const averageScore =
      dayEntries.length > 0 ? totalScore / dayEntries.length : 0;

    trends.push({
      date: dateKey,
      moodCounts,
      averageScore,
    });
  }

  return trends;
}
