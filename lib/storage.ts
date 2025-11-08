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
