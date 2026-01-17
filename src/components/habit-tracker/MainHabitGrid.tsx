"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle } from "lucide-react";
import { Habit } from "@/lib/types";

const daysInMonth = 31;
export const weeks = [
  { label: "Week 1", start: 1, end: 7 },
  { label: "Week 2", start: 8, end: 14 },
  { label: "Week 3", start: 15, end: 21 },
  { label: "Week 4", start: 22, end: 28 },
  { label: "Week 5", start: 29, end: 31 },
];

interface MainHabitGridProps {
  habits: Habit[];
  onToggle: (habitId: string, dayIndex: number) => void;
  onNameChange: (habitId: string, newName: string) => void;
  onAddHabit: (name: string) => void;
}

export function MainHabitGrid({ habits, onToggle, onNameChange, onAddHabit }: MainHabitGridProps) {
  const [newHabitName, setNewHabitName] = useState("");

  const handleCheckboxChange = (habitId: string, dayIndex: number) => {
    onToggle(habitId, dayIndex);
  };

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName("");
    }
  };

  const gridTemplateColumns = `200px repeat(${daysInMonth}, minmax(44px, 1fr))`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Header */}
          <div className="text-center font-semibold text-sm sticky top-0 bg-white z-10 pb-2 border-b">
            <div className="grid" style={{ gridTemplateColumns }}>
              <div className="sticky left-0 bg-white p-2.5">Habit</div>
              {weeks.map((week) => (
                <div
                  key={week.label}
                  style={{ gridColumn: `span ${week.end - week.start + 1}` }}
                >
                  {week.label}
                </div>
              ))}
            </div>
            <div className="grid" style={{ gridTemplateColumns }}>
              <div className="sticky left-0 bg-white"></div>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <div key={i} className="p-2.5">{i + 1}</div>
              ))}
            </div>
          </div>

          <div>
            {habits.map((habit, rowIndex) => (
              <div
                key={habit.id}
                className={`grid items-center transition-colors duration-300 ${rowIndex % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                  } hover:bg-gray-100/60`}
                style={{ gridTemplateColumns }}>
                <div className="sticky left-0 p-2 text-sm font-medium bg-inherit whitespace-nowrap overflow-hidden text-ellipsis">
                  <Input
                    value={habit.name}
                    onChange={(e) => onNameChange(habit.id, e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0"
                  />
                </div>
                {habit.completed_days.map((completed, dayIndex) => (
                  <div key={dayIndex} className="flex justify-center items-center h-full p-2">
                    <Checkbox
                      id={`${habit.id}-day-${dayIndex}`}
                      aria-label={`Mark ${habit.name} as completed for day ${dayIndex + 1}`}
                      checked={completed}
                      onCheckedChange={() =>
                        handleCheckboxChange(habit.id, dayIndex)
                      }
                      className="w-6 h-6 transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="grid items-center mt-4" style={{ gridTemplateColumns }}>
            <div className="sticky left-0 p-2 flex items-center">
              <Input
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Add a new habit..."
                className="w-full text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleAddHabit()}
              />
            </div>
            <div className="col-start-2">
              <Button onClick={handleAddHabit} size="sm" variant="ghost">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

