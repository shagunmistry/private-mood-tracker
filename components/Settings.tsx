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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Export Your Data
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Download your mood diary data to keep a backup or use elsewhere.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport("json")}
            disabled={isExporting}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white
                     font-medium py-3 px-4 rounded-lg shadow
                     transition-colors disabled:opacity-50"
          >
            {isExporting ? "Exporting..." : "Export as JSON"}
          </button>
          <button
            onClick={() => handleExport("csv")}
            disabled={isExporting}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white
                     font-medium py-3 px-4 rounded-lg shadow
                     transition-colors disabled:opacity-50"
          >
            {isExporting ? "Exporting..." : "Export as CSV"}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Import Data
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Restore your mood diary from a previously exported JSON file.
        </p>
        <label
          className="block w-full bg-green-500 hover:bg-green-600 text-white
                   font-medium py-3 px-4 rounded-lg shadow text-center
                   cursor-pointer transition-colors"
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

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Privacy & Storage
        </h3>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
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
              <p className="font-semibold text-green-800 mb-1">
                100% Private & Local
              </p>
              <p className="text-sm text-green-700">
                All your mood entries are stored locally on your device using
                IndexedDB. No data is ever sent to any server. You have complete
                control over your data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Cloud Backup (Coming Soon)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Optional cloud backup integration with Google Drive will be available
          in a future update. Your data will remain encrypted and private.
        </p>
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4
                   rounded-lg cursor-not-allowed"
        >
          Google Drive Backup (Coming Soon)
        </button>
      </div>
    </div>
  );
}
