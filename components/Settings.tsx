"use client";

import { useState } from "react";
import { exportMoodEntries, importMoodEntries } from "@/lib/export";
import type { ExportFormat } from "@/lib/types";

interface SettingsProps {
  onImported: () => void;
}

export default function Settings({ onImported }: SettingsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      await exportMoodEntries(format);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("This will replace all existing data. Continue?")) {
      e.target.value = "";
      return;
    }

    setIsImporting(true);
    try {
      const count = await importMoodEntries(file);
      alert(`Successfully imported ${count} entries!`);
      onImported();
    } catch (error) {
      console.error("Import failed:", error);
      alert("Failed to import data. Please check the file format.");
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          Export Your Data
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--foreground-secondary)" }}>
          Download your mood diary data to keep a backup or use elsewhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleExport("json")}
            disabled={isExporting}
            className="flex-1 font-medium py-3 px-4 rounded-2xl shadow-md transition-all hover:opacity-90 active:animate-buttonPress disabled:opacity-50"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "#ffffff",
            }}
          >
            {isExporting ? "Exporting..." : "Export as JSON"}
          </button>
          <button
            onClick={() => handleExport("csv")}
            disabled={isExporting}
            className="flex-1 font-medium py-3 px-4 rounded-2xl shadow-md transition-all hover:opacity-90 active:animate-buttonPress disabled:opacity-50"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "#ffffff",
            }}
          >
            {isExporting ? "Exporting..." : "Export as CSV"}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          Import Data
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--foreground-secondary)" }}>
          Restore your mood diary from a previously exported JSON file.
        </p>
        <label
          className="block w-full font-medium py-3 px-4 rounded-2xl shadow-md text-center cursor-pointer transition-all hover:opacity-90 active:animate-buttonPress"
          style={{
            backgroundColor: "#34c759",
            color: "#ffffff",
          }}
        >
          {isImporting ? "Importing..." : "Import from JSON"}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="hidden"
          />
        </label>
      </div>

      <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "1.5rem" }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Privacy & Storage
        </h3>
        <div className="glass-card rounded-2xl p-4" style={{ backgroundColor: "rgba(52, 199, 89, 0.1)" }}>
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 flex-shrink-0 mt-0.5"
              style={{ color: "#34c759" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <div>
              <p className="font-semibold mb-1" style={{ color: "#34c759" }}>
                100% Private & Local
              </p>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                All your mood entries are stored locally on your device using
                IndexedDB. No data is ever sent to any server. You have complete
                control over your data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "1.5rem" }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          Cloud Backup (Coming Soon)
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--foreground-secondary)" }}>
          Optional cloud backup integration with Google Drive will be available
          in a future update. Your data will remain encrypted and private.
        </p>
        <button
          disabled
          className="w-full font-medium py-3 px-4 rounded-2xl cursor-not-allowed opacity-50"
          style={{
            backgroundColor: "var(--card-background)",
            color: "var(--foreground-secondary)",
            border: "1px solid var(--card-border)",
          }}
        >
          Google Drive Backup (Coming Soon)
        </button>
      </div>
    </div>
  );
}
