"use client";

import { useState, useEffect } from "react";
import AddMoodEntry from "@/components/AddMoodEntry";
import MoodList from "@/components/MoodList";
import Settings from "@/components/Settings";
import Analytics from "@/components/Analytics";
import PWAInstallButton from "@/components/PWAInstallButton";
import { getAllMoodEntries } from "@/lib/storage";
import type { MoodEntry } from "@/lib/types";

type Tab = "add" | "history" | "analytics" | "settings";

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
    { id: "add" as Tab, label: "Add", icon: "➕" },
    { id: "history" as Tab, label: "History", icon: "📖" },
    { id: "analytics" as Tab, label: "Analytics", icon: "📊" },
    { id: "settings" as Tab, label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen safe-area-inset-top safe-area-inset-bottom" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8 animate-fadeIn">
          <div className="flex justify-center items-center mb-4">
            <PWAInstallButton />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Mood Diary
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "var(--foreground-secondary)" }}>
            Track your emotions privately
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="glass-card rounded-3xl overflow-hidden mb-6 animate-scaleIn">
          {/* iOS-style segmented control */}
          <div className="flex p-2 gap-1" style={{ background: "var(--background-secondary)" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 sm:px-4 text-center font-medium rounded-xl transition-all duration-300 text-xs sm:text-sm
                  ${
                    activeTab === tab.id
                      ? "shadow-md scale-[1.02]"
                      : "hover:bg-[var(--card-background)]"
                  }`}
                style={{
                  background: activeTab === tab.id ? "var(--accent-primary)" : "transparent",
                  color: activeTab === tab.id ? "#ffffff" : "var(--foreground-secondary)",
                }}
              >
                <span className="mr-1 sm:mr-2 text-base sm:text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div
                  className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent"
                  style={{ borderColor: "var(--accent-primary)", borderTopColor: "transparent" }}
                ></div>
                <p className="mt-4" style={{ color: "var(--foreground-secondary)" }}>Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === "add" && (
                  <AddMoodEntry onAdded={handleEntryAdded} />
                )}
                {activeTab === "history" && (
                  <MoodList entries={entries} onUpdate={loadEntries} />
                )}
                {activeTab === "analytics" && <Analytics />}
                {activeTab === "settings" && (
                  <Settings onImported={loadEntries} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs sm:text-sm space-y-2" style={{ color: "var(--foreground-secondary)" }}>
          <p>🔒 Your data is stored locally and never leaves your device</p>
          <p>
            Made with open source ❤️ •{" "}
            <a
              href="https://github.com/shagunmistry/private-mood-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "var(--accent-primary)" }}
            >
              Contribute on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
