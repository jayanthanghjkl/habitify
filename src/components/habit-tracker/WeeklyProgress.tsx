"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useHabitState } from "@/hooks/useHabitState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const weekDefinitions = [
  { label: "Week 1", days: 7, color: "#60A5FA" },
  { label: "Week 2", days: 7, color: "#F472B6" },
  { label: "Week 3", days: 7, color: "#2DD4BF" },
  { label: "Week 4", days: 7, color: "#FBBF24" },
  { label: "Week 5", days: 3, color: "#60A5FA" },
];

const calculateWeeklyProgress = (habits: any[]) => {
  let dayOffset = 0;
  return weekDefinitions.map(week => {
    const totalPossible = habits.length * week.days;
    if (totalPossible === 0) {
      return { ...week, percentage: 0, completed: 0, total: 0 };
    }

    const completed = habits.reduce((acc, habit) => {
      for (let i = 0; i < week.days; i++) {
        if (habit.completed_days[dayOffset + i]) {
          acc++;
        }
      }
      return acc;
    }, 0);

    dayOffset += week.days;
    const percentage = Math.round((completed / totalPossible) * 100);
    return { ...week, percentage, completed, total: totalPossible };
  });
};

export interface WeeklyProgressProps {
  completionData?: number[];
}

export function WeeklyProgress({ completionData }: WeeklyProgressProps) {
  const { habits } = useHabitState();

  const weeklyData = useMemo(() => {
    if (completionData) {
      return weekDefinitions.map((week, index) => ({
        ...week,
        percentage: Math.round(completionData[index] || 0),
        completed: 0, // Not available from simple percentage array
        total: 0
      }));
    }
    return calculateWeeklyProgress(habits);
  }, [habits, completionData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {weeklyData.map((week) => (
            <div key={week.label} className="flex flex-col items-center">
              <div className="w-24 h-24">
                <PieChart width={96} height={96}>
                  <Pie
                    data={[{ value: week.percentage }, { value: 100 - week.percentage }]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={38}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                    stroke="none"
                  >
                    <Cell fill={week.color} />
                    <Cell fill="#E5E7EB" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                    formatter={(value: any, name: any, props: any) => {
                      if (props.payload.value === week.percentage) {
                        const details = week.total > 0 ? ` (${week.completed}/${week.total})` : '';
                        return [`${week.percentage}% complete${details}`];
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </div>
              <p className="text-sm font-semibold mt-2">{week.label}</p>
              <p className="text-xs text-gray-500">{week.percentage}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}