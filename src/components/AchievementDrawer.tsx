import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "@/hooks/useGamification";
import { ACHIEVEMENTS } from "@/lib/achievements";
import {
  Sparkles,
  Compass,
  BookOpen,
  Library,
  HelpCircle,
  Headphones,
  Disc3,
  FileDown,
  MessageCircle,
  Workflow,
  Clock,
  Trophy,
  X,
  Lock,
  Star,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Compass,
  BookOpen,
  Library,
  HelpCircle,
  Headphones,
  Disc3,
  FileDown,
  MessageCircle,
  Workflow,
  Clock,
  Trophy,
};

export function AchievementDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, getProgress } = useGamification();
  const progress = getProgress();
  const unlockedCount = state.achievements.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-ink/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-[71] w-[400px] max-w-[90vw] bg-paper border-l border-border shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.15)] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-border shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Trophy className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-ink leading-none">
                      Achievements
                    </h2>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
                      {unlockedCount} of {totalCount} unlocked
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-ink transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Level + XP Bar */}
              <div className="bg-secondary/50 rounded-xl p-3 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-lg bg-accent text-paper text-xs font-bold font-mono">
                      {progress.level}
                    </span>
                    <span className="text-sm font-semibold text-ink">{progress.name}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {progress.xp} XP{" "}
                    {!progress.isMaxLevel && (
                      <span className="text-muted-foreground/60">
                        / {progress.xpIntoLevel + (progress.xpForNextLevel - progress.xpIntoLevel)}{" "}
                        to next
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 bg-border/40 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.progressPercent}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <div className="grid grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((ach) => {
                  const isUnlocked = state.achievements.includes(ach.id);
                  const Icon = ICON_MAP[ach.icon] || Sparkles;

                  return (
                    <motion.div
                      key={ach.id}
                      initial={false}
                      animate={isUnlocked ? { scale: [1, 1.03, 1] } : {}}
                      className={`relative rounded-xl border p-3.5 transition-all ${
                        isUnlocked
                          ? "bg-card border-border shadow-sm"
                          : "bg-secondary/20 border-border/40"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2.5 ${
                          isUnlocked
                            ? "bg-accent/10 border border-accent/20"
                            : "bg-muted/30 border border-border/30"
                        }`}
                      >
                        {isUnlocked ? (
                          <Icon className="h-4 w-4 text-accent" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
                        )}
                      </div>

                      {/* Text */}
                      <p
                        className={`text-xs font-semibold leading-tight mb-0.5 ${
                          isUnlocked ? "text-ink" : "text-muted-foreground/50"
                        }`}
                      >
                        {isUnlocked ? ach.name : "???"}
                      </p>
                      <p
                        className={`text-[10px] leading-snug ${
                          isUnlocked ? "text-muted-foreground" : "text-muted-foreground/40 italic"
                        }`}
                      >
                        {isUnlocked ? ach.description : ach.hint}
                      </p>

                      {/* XP Badge */}
                      <div className="mt-2">
                        <span
                          className={`inline-block text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                            isUnlocked
                              ? "bg-accent/10 text-accent font-semibold"
                              : "bg-muted/20 text-muted-foreground/40"
                          }`}
                        >
                          {isUnlocked ? `+${ach.xp} XP` : `${ach.xp} XP`}
                        </span>
                      </div>

                      {/* Unlocked checkmark */}
                      {isUnlocked && (
                        <div className="absolute top-2.5 right-2.5">
                          <Star className="h-3 w-3 text-accent fill-accent" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Stats Section */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
                  Exploration Stats
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Pages" value={state.stats.pagesVisited.length} max={4} />
                  <StatCard label="Cases" value={state.stats.casesRead.length} max={8} />
                  <StatCard label="Time" value={formatTime(state.stats.timeOnSite)} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatCard({ label, value, max }: { label: string; value: number | string; max?: number }) {
  return (
    <div className="bg-secondary/30 rounded-xl p-3 text-center border border-border/30">
      <p className="font-serif text-lg font-bold text-ink leading-none">
        {value}
        {max !== undefined && (
          <span className="text-muted-foreground/50 text-xs font-sans">/{max}</span>
        )}
      </p>
      <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </p>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m${secs > 0 ? ` ${secs}s` : ""}`;
}
