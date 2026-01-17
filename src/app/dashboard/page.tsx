"use client";

import { useState, useMemo } from "react";
import { MainHabitGrid as HabitGrid, weeks } from "@/components/habit-tracker/MainHabitGrid";
import { AffirmationCard } from "@/components/habit-tracker/AffirmationCard";
import { TopHabitsCard } from "@/components/habit-tracker/TopHabitsCard";
import { WeeklyProgress } from "@/components/habit-tracker/WeeklyProgress";
import { WeeklyHabits } from "@/components/habit-tracker/WeeklyHabits";
import { MonthlyReflection } from "@/components/habit-tracker/MonthlyReflection";
import { useHabitState } from "@/hooks/useHabitState";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { habits, isSyncing: loading, addHabit, updateHabitName, toggleDay } = useHabitState(currentMonth.toISOString().slice(0, 7));

  const handleMonthChange = (direction: -1 | 1) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const yearStr = currentMonth.getFullYear();

  const weeklyProgress = useMemo(() => {
    return weeks.map(week => {
      let totalPossible = 0;
      let totalCompleted = 0;

      habits.forEach(habit => {
        if (!habit.name) return;

        for (let i = week.start; i <= week.end; i++) {
          totalPossible++;
          if (habit.completed_days[i - 1]) {
            totalCompleted++;
          }
        }
      });

      return totalPossible === 0 ? 0 : (totalCompleted / totalPossible) * 100;
    });
  }, [habits]);

  const stats = useMemo(() => {
    const activeHabits = habits.length;
    let totalChecks = 0;
    habits.forEach(h => totalChecks += h.completed_days.filter(Boolean).length);

    const totalPossible = activeHabits * 31;
    const progress = totalPossible === 0 ? 0 : (totalChecks / totalPossible) * 100;
    return { activeHabits, progress };
  }, [habits]);


  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-pink-100">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 space-y-6 lg:space-y-8">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 lg:gap-8 border-b border-gray-100 pb-6 lg:pb-8">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight transition-all duration-300">{monthName}</h1>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleMonthChange(-1)} className="hover:bg-gray-100 rounded-full">
                  <ChevronLeft className="h-6 w-6 text-gray-400" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleMonthChange(1)} className="hover:bg-gray-100 rounded-full">
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </Button>
              </div>
            </div>
            <p className="text-sm font-semibold tracking-[0.2em] text-gray-400 mt-2 uppercase">Habit Tracker Dashboard • {yearStr}</p>
          </div>

          <div className="flex items-center gap-8">
            <div className="bg-gray-50 px-6 py-3 rounded-lg border border-gray-100 text-right">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Month Progress</p>
              <p className="text-2xl font-bold text-gray-800">{stats.progress.toFixed(1)}%</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="h-96 flex items-center justify-center text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span className="italic">Loading your dashboard...</span>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-auto">
              <div className="lg:col-span-3 h-full">
                <AffirmationCard />
              </div>
              <div className="lg:col-span-6 h-full flex flex-col justify-between">
                <div className="flex-1 bg-white border border-gray-100 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-pink-400" /> {/* Abstract Icon */}
                    Weekly Progress
                  </h3>
                  <div className="h-[calc(100%-2rem)]">
                    <WeeklyProgress completionData={weeklyProgress} />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 h-full">
                <TopHabitsCard />
              </div>
            </div>

            {/* Main Grid */}
            <section>
              <HabitGrid
                habits={habits}
                onToggle={toggleDay}
                onNameChange={updateHabitName}
                onAddHabit={addHabit}
              />
            </section>

            {/* Weekly & Monthly */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div className="lg:col-span-4 bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
                <WeeklyHabits />
              </div>
              <div className="lg:col-span-8">
                <MonthlyReflection />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

