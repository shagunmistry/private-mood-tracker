"use client";

import { useState, useEffect } from "react";
import AddMoodEntry from "@/components/AddMoodEntry";
import MoodList from "@/components/MoodList";
import Settings from "@/components/Settings";
import PWAInstallButton from "@/components/PWAInstallButton";
import { getAllMoodEntries } from "@/lib/storage";
import type { MoodEntry } from "@/lib/types";

type Tab = "add" | "history" | "settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("add");
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = async () => {
    try {
      const data = await getAllMoodEntries();
      setEntries(data);
    } catch (error) {
      console.error("Failed to load entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleEntryAdded = () => {
    loadEntries();
    setActiveTab("history");
  };

  const tabs = [
    { id: "add" as Tab, label: "Add Entry", icon: "➕" },
    { id: "history" as Tab, label: "History", icon: "📖" },
    { id: "settings" as Tab, label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <PWAInstallButton />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Mood Diary
          </h1>
          <p className="text-gray-600">Track your emotions privately</p>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-indigo-500 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === "add" && (
                  <AddMoodEntry onAdded={handleEntryAdded} />
                )}
                {activeTab === "history" && (
                  <MoodList entries={entries} onUpdate={loadEntries} />
                )}
                {activeTab === "settings" && (
                  <Settings onImported={loadEntries} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500">
          <p>🔒 Your data is stored locally and never leaves your device</p>
        </footer>
      </div>
    </div>
  );
}
