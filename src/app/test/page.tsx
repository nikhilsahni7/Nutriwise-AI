// app/components/DailyLog.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Meal {
  id: string;
  name: string;
  createdAt: string;
}

interface DailyLog {
  id: string;
  date: string;
  meals: Meal[];
}

export default function DailyLog() {
  const [date, setDate] = useState(new Date());
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDailyLog() {
      setLoading(true);
      setError("");

      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await fetch(`/api/daily-logs?date=${formattedDate}`);

        if (!response.ok) {
          throw new Error("Failed to fetch daily log");
        }

        const result = await response.json();
        setDailyLog(result.data);
      } catch (err) {
        setError("Error loading daily log");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDailyLog();
  }, [date]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <input
          type="date"
          value={format(date, "yyyy-MM-dd")}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="border rounded p-2"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {dailyLog && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Meals for {format(new Date(dailyLog.date), "MMMM d, yyyy")}
          </h2>

          {dailyLog.meals.length === 0 ? (
            <p>No meals logged for this day</p>
          ) : (
            <ul className="space-y-2">
              {dailyLog.meals.map((meal) => (
                <li key={meal.id} className="border rounded p-3">
                  <p className="font-medium">{meal.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(meal.createdAt), "h:mm a")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
