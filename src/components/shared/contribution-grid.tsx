"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface ContributionGridProps {
  title: string;
  subtitle: string;
  totalCount: number;
  label: string;
}

export function ContributionGrid({
  title,
  subtitle,
  totalCount,
  label,
}: ContributionGridProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Generate the last 371 days (53 weeks * 7 days) to fill the grid perfectly
  const gridData = useMemo(() => {
    const today = new Date();
    const data = [];
    
    // Start from the Sunday of 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    // Align to Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    for (let i = 0; i < 371; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Ensure "all green" by choosing a random submission count between 1 and 12
      const count = Math.floor(Math.random() * 10) + 1;
      
      // Pick a green level (1 to 4)
      let level = 1;
      if (count > 9) level = 4;
      else if (count > 6) level = 3;
      else if (count > 3) level = 2;

      data.push({
        date: currentDate,
        count,
        level,
        id: i,
      });
    }
    return data;
  }, []);

  // Weekday labels
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Group days by week (each week is a column of 7 days)
  const columns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < gridData.length; i += 7) {
      cols.push(gridData.slice(i, i + 7));
    }
    return cols;
  }, [gridData]);

  // Extract month labels with column offsets
  const months = useMemo(() => {
    const labels: { text: string; colIndex: number }[] = [];
    let prevMonth = -1;
    
    columns.forEach((week, colIndex) => {
      const firstDayOfWeek = week[0].date;
      const currentMonth = firstDayOfWeek.getMonth();
      if (currentMonth !== prevMonth) {
        labels.push({
          text: firstDayOfWeek.toLocaleDateString(undefined, { month: "short" }),
          colIndex,
        });
        prevMonth = currentMonth;
      }
    });

    // Filter labels to prevent overcrowding
    return labels.filter((_, idx) => idx % 2 === 0 || idx === labels.length - 1);
  }, [columns]);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    date: Date,
    count: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
    
    if (parentRect) {
      setHoveredDay({
        dateStr: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        count,
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 42,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="anime-card rounded-2xl p-6 relative"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold font-[family-name:var(--font-heading)]">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {totalCount.toLocaleString()} {label} (100% Active)
          </span>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[760px] relative select-none">
          {/* Tooltip */}
          {hoveredDay && (
            <div
              className="absolute z-20 bg-zinc-950 text-white text-xs py-1.5 px-3 rounded-lg border border-zinc-800 shadow-xl pointer-events-none -translate-x-1/2 flex flex-col items-center"
              style={{ left: hoveredDay.x, top: hoveredDay.y }}
            >
              <span className="font-semibold">{hoveredDay.count} submissions</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">{hoveredDay.dateStr}</span>
              <div className="w-2 h-2 bg-zinc-950 border-r border-b border-zinc-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
            </div>
          )}

          {/* Month Headers */}
          <div className="flex text-[10px] text-muted-foreground mb-2 h-4 relative pl-8">
            {months.map((m, idx) => (
              <span
                key={idx}
                className="absolute"
                style={{ left: `calc(${m.colIndex} * 14px + 32px)` }}
              >
                {m.text}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Weekday labels */}
            <div className="flex flex-col justify-between text-[9px] text-muted-foreground h-[92px] w-6 pr-1 pt-1">
              <span>{weekdays[1]}</span>
              <span>{weekdays[3]}</span>
              <span>{weekdays[5]}</span>
            </div>

            {/* Grid Columns */}
            <div className="flex gap-[3px]">
              {columns.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    // Choose green tailwind classes based on level
                    const levelColors = [
                      "bg-emerald-500/15 border-emerald-500/10", // Level 1 (light green tint)
                      "bg-emerald-500/40 border-emerald-500/20", // Level 2
                      "bg-emerald-500/70 border-emerald-500/30", // Level 3
                      "bg-emerald-500 border-emerald-500/40",    // Level 4 (solid active)
                    ];
                    const colorClass = levelColors[day.level - 1];

                    return (
                      <div
                        key={day.id}
                        onMouseEnter={(e) => handleMouseEnter(e, day.date, day.count)}
                        onMouseLeave={handleMouseLeave}
                        className={`w-[11px] h-[11px] rounded-[2px] border transition-colors cursor-pointer ${colorClass} hover:border-primary`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-4">
        <span>365 Consecutive Days Active</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-[11px] h-[11px] rounded-[2px] bg-emerald-500/15 border border-emerald-500/10" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-emerald-500/40 border border-emerald-500/20" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-emerald-500/70 border border-emerald-500/30" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-emerald-500 border border-emerald-500/40" />
          <span>More</span>
        </div>
      </div>
    </motion.div>
  );
}
