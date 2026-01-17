import { useState, useEffect, useCallback } from "react";
import { DashboardState, Habit } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const generateDefaultHabits = (): Habit[] => {
  return [
    { id: "habit-1", name: "Read 10 pages", completed_days: new Array(31).fill(false) },
    { id: "habit-2", name: "30-min workout", completed_days: new Array(31).fill(false) },
    { id: "habit-3", name: "Meditate", completed_days: new Array(31).fill(false) },
    { id: "habit-4", name: "No social media after 10 PM", completed_days: new Array(31).fill(false) },
    { id: "habit-5", name: "Drink 8 glasses of water", completed_days: new Array(31).fill(false) },
  ];
};

const getInitialState = (): DashboardState => {
  return {
    habits: generateDefaultHabits(),
    lastUpdated: new Date().toISOString(),
    monthlyReflection: "",
    weeklyHabits: new Array(5).fill(false),
    affirmationImage: null,
  };
};

export const useHabitState = (currentMonth?: string) => {
  const [state, setState] = useState<DashboardState>(getInitialState);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const monthStr = currentMonth || new Date().toISOString().slice(0, 7);



  const fetchFromSupabase = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setIsSyncing(true);

      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (habitsError) throw habitsError;

      const { data: logsData, error: logsError } = await supabase
        .from("habit_logs")
        .select("habit_id, day_index, completed_at")
        .eq("user_id", user.id)
        .eq("month", monthStr);

      if (logsError) throw logsError;

      const startOfWeek = getStartOfWeek(new Date()).toISOString().split('T')[0];
      const { data: weeklyData } = await supabase
        .from("weekly_habits")
        .select("habits_state")
        .eq("user_id", user.id)
        .eq("week_start_date", startOfWeek)
        .maybeSingle();

      const { data: reflectionData } = await supabase
        .from("monthly_reflections")
        .select("content")
        .eq("user_id", user.id)
        .eq("month", monthStr)
        .maybeSingle();

      if (habitsData) {
        const serverHabits = habitsData.map((h: any) => {
          const completedDays = new Array(31).fill(false);
          logsData?.forEach((log: any) => {
            if (log.habit_id === h.id && log.day_index >= 0 && log.day_index < 31) {
              completedDays[log.day_index] = true;
            }
          });
          return { id: h.id, name: h.name, completed_days: completedDays };
        });

        const defaults = generateDefaultHabits();

        let merged = defaults.map(def => {
          const serverMatch = serverHabits.find(s => s.name === def.name);
          return serverMatch || def;
        });

        const customHabits = serverHabits.filter(s => !defaults.some(def => def.name === s.name));
        merged = [...merged, ...customHabits];

        setState(prev => ({
          ...prev,
          habits: merged,
          weeklyHabits: weeklyData?.habits_state || new Array(5).fill(false),
          monthlyReflection: reflectionData?.content || "",
          lastUpdated: new Date().toISOString()
        }));
      }

      setIsHydrated(true);

    } catch (error: any) {
      console.error("Supabase sync error:", JSON.stringify(error, null, 2));
      if (error?.code === "PGRST301" || error?.message?.includes("column")) {
        toast.error("Database schema mismatch. Please run migration.");
      } else {
        toast.error(`Failed to sync data: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsSyncing(false);
      setIsHydrated(true);
    }
  }, [supabase, monthStr]);

  useEffect(() => {
    fetchFromSupabase();
  }, [fetchFromSupabase]);

  const toggleDay = async (habitId: string, dayIndex: number) => {
    setState((prev) => {
      const newHabits = prev.habits.map((h) => {
        if (h.id === habitId) {
          const newCompleted = [...h.completed_days];
          newCompleted[dayIndex] = !newCompleted[dayIndex];
          return { ...h, completed_days: newCompleted };
        }
        return h;
      });
      return { ...prev, habits: newHabits, lastUpdated: new Date().toISOString() };
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentHabit = state.habits.find(h => h.id === habitId);
      const isCompletedNow = !currentHabit?.completed_days[dayIndex];

      if (isCompletedNow) {
        const { error } = await supabase.from("habit_logs").upsert({
          user_id: user.id,
          habit_id: habitId,
          month: monthStr,
          day_index: dayIndex,
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,habit_id,day_index,month' });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("habit_logs").delete().match({
          user_id: user.id,
          habit_id: habitId,
          month: monthStr,
          day_index: dayIndex
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error("Error toggling habit:", error);
      toast.error("Failed to save progress");
    }
  };

  const addHabit = async (name: string) => {
    const tempId = `temp-${Date.now()}`;
    const newHabit: Habit = { id: tempId, name, completed_days: new Array(31).fill(false) };

    setState(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
      lastUpdated: new Date().toISOString()
    }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.from("habits").insert({
        user_id: user.id,
        name
      }).select().single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        habits: prev.habits.map(h => h.id === tempId ? { ...h, id: data.id } : h)
      }));
    } catch (error: any) {
      console.error("Error adding habit:", error);
      toast.error("Failed to add habit");
      setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== tempId) }));
    }
  };

  const updateHabitName = async (habitId: string, newName: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === habitId ? { ...h, name: newName } : h),
      lastUpdated: new Date().toISOString()
    }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("habits").update({ name: newName }).eq("id", habitId);
      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating habit:", error);
      toast.error("Failed to update habit name");
    }
  };

  const setWeeklyHabits = async (newWeekly: boolean[]) => {
    setState(prevState => ({ ...prevState, weeklyHabits: newWeekly, lastUpdated: new Date().toISOString() }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const startOfWeek = getStartOfWeek(new Date()).toISOString().split('T')[0];

    try {
      const { error } = await supabase.from("weekly_habits").upsert({
        user_id: user.id,
        week_start_date: startOfWeek,
        habits_state: newWeekly,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,week_start_date' });

      if (error) throw error;
    } catch (err) {
      console.error("Failed to save weekly habits", err);
      toast.error("Failed to save weekly progress");
    }
  };

  const setMonthlyReflection = async (reflection: string) => {
    setState(prevState => ({ ...prevState, monthlyReflection: reflection, lastUpdated: new Date().toISOString() }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.from("monthly_reflections").upsert({
        user_id: user.id,
        month: monthStr,
        content: reflection,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,month' });

      if (error) throw error;
    } catch (err) {
      console.error("Failed to save reflection", err);
    }
  };

  const setAffirmationImage = (image: string | null) => {
    setState(prevState => ({ ...prevState, affirmationImage: image, lastUpdated: new Date().toISOString() }));
  };

  return {
    ...state,
    toggleDay,
    addHabit,
    updateHabitName,
    setWeeklyHabits, // Now async DB sync
    setMonthlyReflection, // Now async DB sync
    setAffirmationImage,
    setState,
    isSyncing
  };
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};
