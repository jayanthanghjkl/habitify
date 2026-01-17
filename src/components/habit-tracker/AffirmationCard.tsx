import { Quote } from "lucide-react";

export function AffirmationCard() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-200/40 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100/50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-200/40 transition-colors duration-500" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 text-indigo-400">
          <Quote className="w-5 h-5 rotate-180" />
          <span className="text-xs font-bold uppercase tracking-widest opacity-70">Daily Focus</span>
        </div>

        <blockquote className="text-xl lg:text-2xl leading-relaxed text-indigo-950 font-medium italic">
          "Small steps every day add up to big results over time."
        </blockquote>
      </div>

      <div className="relative z-10 flex items-center gap-3 mt-4">
        <div className="h-1 flex-1 bg-indigo-100 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-indigo-400/30 rounded-full" />
        </div>
        <span className="text-xs font-medium text-indigo-400">Stay Consistent</span>
      </div>
    </div>
  );
}
