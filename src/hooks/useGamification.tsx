import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { ACHIEVEMENTS, getLevelForXP, getAchievement } from "@/lib/achievements";

// ── Types ──────────────────────────────────────────────────────────
export interface GamificationStats {
  pagesVisited: string[];
  casesRead: string[];
  timeOnSite: number;
  faqsOpened: number;
  spotifyPlayed: boolean;
  spotifyGenres: string[];
  resumeDownloaded: boolean;
  contactVisited: boolean;
  processRead: boolean;
  aboutRead: boolean;
  projectsFiltered: boolean;
}

export interface GamificationState {
  xp: number;
  achievements: string[];
  stats: GamificationStats;
}

export interface AchievementUnlock {
  id: string;
  name: string;
  description: string;
  xp: number;
  icon: string;
  timestamp: number;
}

interface GamificationContextValue {
  state: GamificationState;
  grantXP: (amount: number) => void;
  trackPageVisit: (path: string) => void;
  trackCaseRead: (slug: string) => void;
  trackFaqOpen: () => void;
  trackSpotifyPlay: () => void;
  trackSpotifyGenre: (genreId: string) => void;
  trackResumeDownload: () => void;
  trackContactVisit: () => void;
  trackProcessRead: () => void;
  trackAboutRead: () => void;
  trackProjectFilter: () => void;
  getProgress: () => ReturnType<typeof getLevelForXP>;
  pendingToasts: AchievementUnlock[];
  dismissToast: (id: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

// ── Constants ──────────────────────────────────────────────────────
const STORAGE_KEY = "portfolio-gamification";
const TIME_THRESHOLD = 180; // seconds for time_investor achievement

const defaultStats: GamificationStats = {
  pagesVisited: [],
  casesRead: [],
  timeOnSite: 0,
  faqsOpened: 0,
  spotifyPlayed: false,
  spotifyGenres: [],
  resumeDownloaded: false,
  contactVisited: false,
  processRead: false,
  aboutRead: false,
  projectsFiltered: false,
};

const defaultState: GamificationState = {
  xp: 0,
  achievements: [],
  stats: { ...defaultStats },
};

// ── Helpers ────────────────────────────────────────────────────────
function loadState(): GamificationState {
  if (typeof window === "undefined") return { ...defaultState };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return {
      xp: parsed.xp ?? 0,
      achievements: parsed.achievements ?? [],
      stats: { ...defaultStats, ...parsed.stats },
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState(state: GamificationState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or private browsing — fail silently
  }
}

// ── Context ────────────────────────────────────────────────────────
const GamificationContext = createContext<GamificationContextValue | null>(null);

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error("useGamification must be used within <GamificationProvider>");
  }
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────
export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GamificationState>(loadState);
  const [pendingToasts, setPendingToasts] = useState<AchievementUnlock[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const stateRef = useRef(state);

  // Keep ref in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Persist on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Time tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const newTime = prev.stats.timeOnSite + 1;
        return {
          ...prev,
          stats: { ...prev.stats, timeOnSite: newTime },
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check time-based achievement
  useEffect(() => {
    if (
      state.stats.timeOnSite >= TIME_THRESHOLD &&
      !state.achievements.includes("time_investor")
    ) {
      unlockAchievement("time_investor");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.stats.timeOnSite]);

  // ── Achievement unlock logic ──
  const unlockAchievement = useCallback(
    (id: string) => {
      setState((prev) => {
        if (prev.achievements.includes(id)) return prev;
        const ach = getAchievement(id);
        if (!ach) return prev;

        const newAchievements = [...prev.achievements, id];
        const newXP = prev.xp + ach.xp;

        // Queue toast
        setPendingToasts((toasts) => [
          ...toasts,
          {
            id: ach.id,
            name: ach.name,
            description: ach.description,
            xp: ach.xp,
            icon: ach.icon,
            timestamp: Date.now(),
          },
        ]);

        return {
          ...prev,
          xp: newXP,
          achievements: newAchievements,
        };
      });
    },
    [],
  );

  // Check completionist after every achievement unlock
  useEffect(() => {
    const nonCompletionist = ACHIEVEMENTS.filter((a) => a.id !== "completionist");
    const allUnlocked = nonCompletionist.every((a) =>
      state.achievements.includes(a.id),
    );
    if (allUnlocked && !state.achievements.includes("completionist")) {
      unlockAchievement("completionist");
    }
  }, [state.achievements, unlockAchievement]);

  // ── Track actions ──
  const grantXP = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const trackPageVisit = useCallback(
    (path: string) => {
      setState((prev) => {
        const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
        if (prev.stats.pagesVisited.includes(normalizedPath)) return prev;
        const newPages = [...prev.stats.pagesVisited, normalizedPath];
        return {
          ...prev,
          stats: { ...prev.stats, pagesVisited: newPages },
        };
      });

      // Check first_visit
      const s = stateRef.current;
      if (!s.achievements.includes("first_visit")) {
        unlockAchievement("first_visit");
      }

      // Check explorer (all 4 main pages visited)
      // We need the updated state, so we schedule a microtask
      setTimeout(() => {
        const current = stateRef.current;
        const required = ["/", "/about", "/process", "/contact"];
        const allVisited = required.every((p) =>
          current.stats.pagesVisited.includes(p),
        );
        if (allVisited && !current.achievements.includes("explorer")) {
          unlockAchievement("explorer");
        }
      }, 100);
    },
    [unlockAchievement],
  );

  const trackCaseRead = useCallback(
    (slug: string) => {
      setState((prev) => {
        if (prev.stats.casesRead.includes(slug)) return prev;
        const newCases = [...prev.stats.casesRead, slug];
        return {
          ...prev,
          stats: { ...prev.stats, casesRead: newCases },
        };
      });

      // Check deep_reader
      const s = stateRef.current;
      if (!s.achievements.includes("deep_reader")) {
        unlockAchievement("deep_reader");
      }

      // Check all_cases
      setTimeout(() => {
        const current = stateRef.current;
        if (current.stats.casesRead.length >= 8 && !current.achievements.includes("all_cases")) {
          unlockAchievement("all_cases");
        }
      }, 100);
    },
    [unlockAchievement],
  );

  const trackFaqOpen = useCallback(() => {
    setState((prev) => {
      const newCount = prev.stats.faqsOpened + 1;
      return {
        ...prev,
        stats: { ...prev.stats, faqsOpened: newCount },
      };
    });

    setTimeout(() => {
      const current = stateRef.current;
      if (current.stats.faqsOpened >= 3 && !current.achievements.includes("faq_curious")) {
        unlockAchievement("faq_curious");
      }
    }, 100);
  }, [unlockAchievement]);

  const trackSpotifyPlay = useCallback(() => {
    setState((prev) => {
      if (prev.stats.spotifyPlayed) return prev;
      return {
        ...prev,
        stats: { ...prev.stats, spotifyPlayed: true },
      };
    });

    setTimeout(() => {
      const current = stateRef.current;
      if (!current.achievements.includes("music_lover")) {
        unlockAchievement("music_lover");
      }
    }, 100);
  }, [unlockAchievement]);

  const trackSpotifyGenre = useCallback(
    (genreId: string) => {
      setState((prev) => {
        if (prev.stats.spotifyGenres.includes(genreId)) return prev;
        const newGenres = [...prev.stats.spotifyGenres, genreId];
        return {
          ...prev,
          stats: { ...prev.stats, spotifyGenres: newGenres },
        };
      });

      setTimeout(() => {
        const current = stateRef.current;
        if (
          current.stats.spotifyGenres.length >= 3 &&
          !current.achievements.includes("dj_mode")
        ) {
          unlockAchievement("dj_mode");
        }
      }, 100);
    },
    [unlockAchievement],
  );

  const trackResumeDownload = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, resumeDownloaded: true },
    }));
    const s = stateRef.current;
    if (!s.achievements.includes("resume_grab")) {
      unlockAchievement("resume_grab");
    }
  }, [unlockAchievement]);

  const trackContactVisit = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, contactVisited: true },
    }));
    const s = stateRef.current;
    if (!s.achievements.includes("connector")) {
      unlockAchievement("connector");
    }
  }, [unlockAchievement]);

  const trackProcessRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, processRead: true },
    }));
    const s = stateRef.current;
    if (!s.achievements.includes("process_nerd")) {
      unlockAchievement("process_nerd");
    }
  }, [unlockAchievement]);

  const trackAboutRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, aboutRead: true },
    }));
  }, []);

  const trackProjectFilter = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, projectsFiltered: true },
    }));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setPendingToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getProgress = useCallback(() => {
    return getLevelForXP(state.xp);
  }, [state.xp]);

  const value: GamificationContextValue = {
    state,
    grantXP,
    trackPageVisit,
    trackCaseRead,
    trackFaqOpen,
    trackSpotifyPlay,
    trackSpotifyGenre,
    trackResumeDownload,
    trackContactVisit,
    trackProcessRead,
    trackAboutRead,
    trackProjectFilter,
    getProgress,
    pendingToasts,
    dismissToast,
    drawerOpen,
    setDrawerOpen,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}
