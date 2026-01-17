"use client";

import { useHabitState } from "@/hooks/useHabitState";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function MonthlyReflection() {
  const { monthlyReflection, setMonthlyReflection } = useHabitState();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Monthly Reflection</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <Textarea
          placeholder="What went well this month? What could be improved?..."
          className="w-full h-full border-0 rounded-none bg-ruled-paper bg-white leading-6 resize-none focus:outline-none focus:ring-0"
          style={{ backgroundSize: "100% 24px" }}
          value={monthlyReflection}
          onChange={(e) => setMonthlyReflection(e.target.value)}
          rows={10}
        />
      </CardContent>
    </Card>
  );
}