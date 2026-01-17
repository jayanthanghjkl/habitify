export type Habit = {
  id: string;
  name: string;
  completed_days: boolean[]; // length 31
};

export type DashboardState = {
  habits: Habit[];
  lastUpdated: string;
  monthlyReflection: string;
  weeklyHabits: boolean[];
  affirmationImage: string | null;
};
