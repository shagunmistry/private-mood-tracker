import type { MoodEntry, ExportFormat } from "./types";
import { exportAllData } from "./storage";

// Convert mood entries to CSV format
function convertToCSV(entries: MoodEntry[]): string {
  if (entries.length === 0) {
    return "ID,Mood,Note,Date,Time\n";
  }

  const headers = ["ID", "Mood", "Note", "Date", "Time"];
  const rows = entries.map((entry) => {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    const note = entry.note ? `"${entry.note.replace(/"/g, '""')}"` : "";

    return [entry.id, entry.mood, note, dateStr, timeStr].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

// Export mood entries
export async function exportMoodEntries(
  format: ExportFormat = "json"
): Promise<void> {
  try {
    const entries = await exportAllData();

    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === "json") {
      content = JSON.stringify(entries, null, 2);
      mimeType = "application/json";
      extension = "json";
    } else {
      content = convertToCSV(entries);
      mimeType = "text/csv";
      extension = "csv";
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];

    link.href = url;
    link.download = `mood-diary-${timestamp}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
    throw new Error("Failed to export mood entries");
  }
}

// Import mood entries from JSON file
export async function importMoodEntries(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const entries = JSON.parse(content) as MoodEntry[];

        // Validate entries
        if (!Array.isArray(entries)) {
          throw new Error("Invalid file format");
        }

        // Import to storage
        const { importData } = await import("./storage");
        await importData(entries);

        resolve(entries.length);
      } catch (error) {
        reject(new Error("Failed to import file"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
