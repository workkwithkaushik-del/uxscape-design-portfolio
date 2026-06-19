import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import type { AchievementUnlock } from "@/hooks/useGamification";
import { useGamification } from "@/hooks/useGamification";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Compass, BookOpen, Library, HelpCircle, Headphones,
  Disc3, FileDown, MessageCircle, Workflow, Clock, Trophy,
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: AchievementUnlock;
  onDismiss: () => void;
}) {
  const Icon = ICON_MAP[toast.icon] || Sparkles;

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -80, scale: 0.85, filter: "blur(4px)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative w-[320px] rounded-2xl border border-border/60 bg-paper/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-accent via-accent/60 to-transparent" />

      <div className="p-4 flex items-start gap-3.5">
        {/* Icon badge */}
        <div className="shrink-0 h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-accent" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-accent font-semibold">
              Achievement Unlocked
            </span>
          </div>
          <p className="font-serif text-base font-bold text-ink leading-tight">
            {toast.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            {toast.description}
          </p>
          <span className="inline-block mt-1.5 text-[10px] font-mono text-accent font-semibold bg-accent/8 px-2 py-0.5 rounded-full">
            +{toast.xp} XP
          </span>
        </div>

        {/* Close */}
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-lg text-muted-foreground hover:text-ink hover:bg-secondary/60 transition-colors cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <motion.div
        className="h-[2px] bg-accent/40 origin-left"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: "linear" }}
      />
    </motion.div>
  );
}

export function AchievementToast() {
  const { pendingToasts, dismissToast } = useGamification();

  const handleDismiss = useCallback(
    (id: string) => dismissToast(id),
    [dismissToast],
  );

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {pendingToasts.map((toast) => (
          <div key={toast.id + toast.timestamp} className="pointer-events-auto">
            <ToastCard
              toast={toast}
              onDismiss={() => handleDismiss(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
