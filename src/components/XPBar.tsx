import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useGamification } from "@/hooks/useGamification";
import { Trophy } from "lucide-react";

export function XPBar() {
  const { getProgress, state, setDrawerOpen } = useGamification();
  const progress = getProgress();
  const [levelUpPulse, setLevelUpPulse] = useState(false);
  const prevLevelRef = useRef(progress.level);

  // Detect level-up
  useEffect(() => {
    if (progress.level > prevLevelRef.current) {
      setLevelUpPulse(true);
      const timer = setTimeout(() => setLevelUpPulse(false), 2000);
      prevLevelRef.current = progress.level;
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = progress.level;
  }, [progress.level]);

  // Smooth XP animation
  const springProgress = useSpring(progress.progressPercent, {
    stiffness: 100,
    damping: 20,
  });

  // Update spring when progress changes
  useEffect(() => {
    springProgress.set(progress.progressPercent);
  }, [progress.progressPercent, springProgress]);

  const widthPercent = useTransform(springProgress, (v) => `${v}%`);

  return (
    <button
      onClick={() => setDrawerOpen(true)}
      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 hover:border-accent/40 bg-secondary/40 hover:bg-secondary/60 transition-all cursor-pointer"
      title={`Level ${progress.level}: ${progress.name} · ${progress.xp} XP · Click to view achievements`}
    >
      {/* Level badge */}
      <span
        className={`inline-flex items-center justify-center h-5.5 w-5.5 rounded-md text-[10px] font-bold font-mono transition-all ${
          levelUpPulse
            ? "bg-accent text-paper animate-[xp-pulse_0.6s_ease-in-out_3] shadow-[0_0_12px_rgba(var(--ember),0.5)]"
            : "bg-accent/15 text-accent group-hover:bg-accent group-hover:text-paper"
        }`}
      >
        {progress.level}
      </span>

      {/* XP bar */}
      <div className="w-14 h-1.5 bg-border/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          style={{ width: widthPercent }}
        />
      </div>

      {/* XP count */}
      <span className="text-[10px] font-mono text-muted-foreground group-hover:text-ink transition-colors tabular-nums">
        {progress.xp}
      </span>

      {/* Trophy icon */}
      <Trophy className="h-3 w-3 text-muted-foreground/50 group-hover:text-accent transition-colors" />

      {/* Achievement count badge (if any unlocked) */}
      {state.achievements.length > 0 && (
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-accent text-paper text-[8px] font-bold font-mono flex items-center justify-center ring-2 ring-paper">
          {state.achievements.length}
        </span>
      )}
    </button>
  );
}
