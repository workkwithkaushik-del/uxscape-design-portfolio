export interface Achievement {
  id: string;
  name: string;
  description: string;
  hint: string; // shown when locked
  xp: number;
  icon: string; // lucide icon name
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_visit",
    name: "First Impression",
    description: "Welcome! You've landed on the portfolio.",
    hint: "Visit the homepage",
    xp: 10,
    icon: "Sparkles",
  },
  {
    id: "explorer",
    name: "Page Turner",
    description: "Visited every section of the site.",
    hint: "Explore all pages",
    xp: 50,
    icon: "Compass",
  },
  {
    id: "deep_reader",
    name: "Deep Diver",
    description: "Read a full case study end-to-end.",
    hint: "Read a case study thoroughly",
    xp: 75,
    icon: "BookOpen",
  },
  {
    id: "all_cases",
    name: "Case Completionist",
    description: "Read all 8 case studies.",
    hint: "Read every case study",
    xp: 150,
    icon: "Library",
  },
  {
    id: "faq_curious",
    name: "Curious Mind",
    description: "Opened 3+ FAQ questions.",
    hint: "Explore the FAQ section",
    xp: 30,
    icon: "HelpCircle",
  },
  {
    id: "music_lover",
    name: "Audiophile",
    description: "Played a track on the Spotify player.",
    hint: "Try the music player",
    xp: 25,
    icon: "Headphones",
  },
  {
    id: "dj_mode",
    name: "DJ Mode",
    description: "Tried all 3 music genres.",
    hint: "Switch between all genres",
    xp: 40,
    icon: "Disc3",
  },
  {
    id: "resume_grab",
    name: "Résumé Collected",
    description: "Downloaded the résumé.",
    hint: "Grab the résumé",
    xp: 20,
    icon: "FileDown",
  },
  {
    id: "connector",
    name: "Let's Connect",
    description: "Visited the contact page.",
    hint: "Find ways to connect",
    xp: 20,
    icon: "MessageCircle",
  },
  {
    id: "process_nerd",
    name: "Process Nerd",
    description: "Read the full design process.",
    hint: "Learn how I work",
    xp: 50,
    icon: "Workflow",
  },
  {
    id: "time_investor",
    name: "Time Well Spent",
    description: "Spent 3+ minutes exploring.",
    hint: "Take your time browsing",
    xp: 60,
    icon: "Clock",
  },
  {
    id: "completionist",
    name: "Portfolio Master",
    description: "Unlocked all other achievements.",
    hint: "Unlock every achievement",
    xp: 200,
    icon: "Trophy",
  },
];

export const LEVELS = [
  { level: 1, name: "Visitor", xpRequired: 0 },
  { level: 2, name: "Explorer", xpRequired: 100 },
  { level: 3, name: "Researcher", xpRequired: 250 },
  { level: 4, name: "Advocate", xpRequired: 500 },
  { level: 5, name: "Insider", xpRequired: 800 },
];

export function getLevelForXP(xp: number) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      current = level;
    } else {
      break;
    }
  }
  const currentIndex = LEVELS.indexOf(current);
  const next = LEVELS[currentIndex + 1] || null;
  const xpIntoLevel = xp - current.xpRequired;
  const xpForNextLevel = next ? next.xpRequired - current.xpRequired : 1;
  const progressPercent = next
    ? Math.min((xpIntoLevel / xpForNextLevel) * 100, 100)
    : 100;

  return {
    level: current.level,
    name: current.name,
    xp,
    xpIntoLevel,
    xpForNextLevel,
    progressPercent,
    isMaxLevel: !next,
  };
}

export function getAchievement(id: string) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
