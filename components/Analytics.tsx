"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { getMoodStatistics, getMoodTrends, type MoodStatistics, type MoodTrend } from "@/lib/storage";
import { MOOD_OPTIONS } from "@/lib/types";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export default function Analytics() {
  const [statistics, setStatistics] = useState<MoodStatistics | null>(null);
  const [trends, setTrends] = useState<MoodTrend[]>([]);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [stats, trendData] = await Promise.all([
        getMoodStatistics(),
        getMoodTrends(timeRange),
      ]);
      setStatistics(stats);
      setTrends(trendData);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[var(--foreground-secondary)]">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!statistics || statistics.totalEntries === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          No data yet
        </h3>
        <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
          Start tracking your mood to see analytics and insights
        </p>
      </div>
    );
  }

  // Prepare doughnut chart data
  const doughnutData = {
    labels: Object.keys(statistics.moodCounts).map(
      (mood) => MOOD_OPTIONS[mood as keyof typeof MOOD_OPTIONS]?.label || mood
    ),
    datasets: [
      {
        data: Object.values(statistics.moodCounts),
        backgroundColor: Object.keys(statistics.moodCounts).map(
          (mood) => MOOD_OPTIONS[mood as keyof typeof MOOD_OPTIONS]?.color || "#94a3b8"
        ),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          font: {
            size: 12,
            family: "system-ui, -apple-system, sans-serif",
          },
          color: "var(--foreground)",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "var(--card-background)",
        titleColor: "var(--foreground)",
        bodyColor: "var(--foreground)",
        borderColor: "var(--card-border)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = statistics.moodPercentages[
              Object.keys(statistics.moodCounts)[context.dataIndex]
            ]?.toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Prepare line chart data
  const lineData = {
    labels: trends.map((t) => {
      const date = new Date(t.date);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Average Mood Score",
        data: trends.map((t) => t.averageScore),
        borderColor: "var(--accent-primary)",
        backgroundColor: "rgba(0, 122, 255, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "var(--accent-primary)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "var(--card-background)",
        titleColor: "var(--foreground)",
        bodyColor: "var(--foreground)",
        borderColor: "var(--card-border)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `Score: ${context.parsed.y.toFixed(2)}/5`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          color: "var(--foreground-secondary)",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "var(--card-border)",
        },
      },
      x: {
        ticks: {
          color: "var(--foreground-secondary)",
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const mostCommonMoodEmoji = MOOD_OPTIONS[statistics.mostCommonMood as keyof typeof MOOD_OPTIONS]?.emoji || "😊";

  return (
    <div className="space-y-6 pb-8 animate-slideUp">
      {/* Time Range Selector */}
      <div className="flex justify-center gap-2 px-4">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days as 7 | 30 | 90)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              timeRange === days
                ? "bg-[var(--accent-primary)] text-white shadow-md"
                : "bg-[var(--card-background)] text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
            }`}
            style={{
              border: timeRange === days ? "none" : "1px solid var(--card-border)",
            }}
          >
            {days} days
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4">
        <StatCard
          title="Total Entries"
          value={statistics.totalEntries.toString()}
          icon="📝"
        />
        <StatCard
          title="Most Common"
          value={MOOD_OPTIONS[statistics.mostCommonMood as keyof typeof MOOD_OPTIONS]?.label || "N/A"}
          icon={mostCommonMoodEmoji}
        />
        <StatCard
          title="Current Streak"
          value={`${statistics.currentStreak} days`}
          icon="🔥"
        />
        <StatCard
          title="Longest Streak"
          value={`${statistics.longestStreak} days`}
          icon="⭐"
        />
      </div>

      {/* Mood Distribution Chart */}
      <div className="glass-card rounded-3xl p-6 mx-4">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Mood Distribution
        </h3>
        <div className="h-[280px] sm:h-[320px]">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Mood Trends Chart */}
      <div className="glass-card rounded-3xl p-6 mx-4">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Mood Trend
        </h3>
        <div className="h-[280px] sm:h-[320px]">
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="mt-4 text-xs text-center" style={{ color: "var(--foreground-secondary)" }}>
          Average mood score: {statistics.averageMoodScore.toFixed(2)}/5.00
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="glass-card rounded-2xl p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-xs mb-1" style={{ color: "var(--foreground-secondary)" }}>
        {title}
      </div>
      <div className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        {value}
      </div>
    </div>
  );
}
