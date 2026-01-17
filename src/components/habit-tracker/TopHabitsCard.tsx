"use client";

import { useMemo } from "react";
import { useHabitState } from "@/hooks/useHabitState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Habit } from "@/lib/types";

const calculateTopHabits = (habits: Habit[]) => {
  if (!habits || habits.length === 0) return [];

  const habitsWithCompletion = habits.map((habit) => {
    const completedCount = habit.completed_days.filter(Boolean).length;
    const totalDays = habit.completed_days.length;
    const percentage = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
    return { ...habit, percentage };
  });

  return habitsWithCompletion.sort((a, b) => b.percentage - a.percentage).slice(0, 5);
};

export function TopHabitsCard() {
  const { habits } = useHabitState();
  const topHabits = useMemo(() => calculateTopHabits(habits), [habits]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Habits</CardTitle>
      </CardHeader>
      <CardContent>
        {topHabits.length > 0 ? (
          <ul className="space-y-4">
            {topHabits.map((habit) => (
              <li key={habit.id} className="group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{habit.name}</span>
                  <span className="text-sm font-bold">{habit.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${habit.percentage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No habit data yet. Start tracking to see your top habits here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}