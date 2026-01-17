"use client";

import { useHabitState } from "@/hooks/useHabitState";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const weeklyGoals = [
  "Plan week ahead",
  "Review weekly spending",
  "Digital declutter",
  "Try one new thing",
  "Connect with a friend",
];

export function WeeklyHabits() {
  const { weeklyHabits, setWeeklyHabits } = useHabitState();

  const handleCheckedChange = (index: number) => {
    const newWeeklyHabits = [...weeklyHabits];
    newWeeklyHabits[index] = !newWeeklyHabits[index];
    setWeeklyHabits(newWeeklyHabits);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyGoals.map((goal, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Checkbox
                id={`weekly-goal-${index}`}
                checked={weeklyHabits[index]}
                onCheckedChange={() => handleCheckedChange(index)}
                className="h-5 w-5"
              />
              <label
                htmlFor={`weekly-goal-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {goal}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}