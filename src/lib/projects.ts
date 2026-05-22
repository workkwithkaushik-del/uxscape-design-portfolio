import coverKitchenIq from "@/assets/cover-kitchen-iq.jpg";
import coverFinanceZ from "@/assets/cover-finance-z.jpg";
import coverAroma from "@/assets/cover-aroma-labs.jpg";
import coverBoult from "@/assets/cover-boult-audio.jpg";
import coverAston from "@/assets/cover-aston-martin.jpg";
import coverEricsson from "@/assets/cover-ericsson.jpg";
import coverTrident from "@/assets/cover-trident.jpg";
import coverLoreal from "@/assets/cover-loreal.jpg";

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  year: string;
  role: string;
  status: "Done" | "In progress" | "Coming soon";
  tldr: { problem: string; solution: string; result: string };
  tags: string[];
  hero: string;
  cover: string;
  liveUrl?: string;
  liveLabel?: string;
  hasFullCase?: boolean;
};

export const projects: Project[] = [
  {
    slug: "kitchen-iq",
    title: "KitchenIQ",
    kicker:
      "A Bloomberg Terminal for India's cloud kitchens, real-time demand, price, and competitive intelligence built on Swiggy's live network.",
    year: "2026",
    role: "Founding Designer · 0→1 SaaS",
    status: "Coming soon",
    tldr: {
      problem:
        "India's 18,000+ cloud kitchen operators decide what to cook, where to expand, and how to price using gut feel, and 60% fail inside 18 months.",
      solution:
        "A real-time market-intelligence SaaS built on Swiggy's live restaurant, menu, and pricing APIs, three lenses: Demand, Price, Competitive.",
      result:
        "In design now. Targeting 100 paying brands in Year 1 (₹6 Cr ARR) on a ₹1,800 Cr TAM.",
    },
    tags: ["B2B SaaS", "Data viz", "0→1", "In design"],
    hero: "linear-gradient(135deg, oklch(0.32 0.05 145) 0%, oklch(0.55 0.14 155) 100%)",
    cover: coverKitchenIq,
    hasFullCase: true,
  },
  {
    slug: "finance-z",
    title: "Finance Z: Track, Plan & Slay",
    kicker:
      "Turning messy student money habits into smart, social, goal-driven finance, designed for Gen Z, not at them.",
    year: "2023",
    role: "Lead Product Designer · 0→1",
    status: "Done",
    tldr: {
      problem:
        "Students were drowning in scattered UPI receipts, group-split chaos, and finance apps that spoke like accountants, 73% abandoned within two weeks.",
      solution:
        "A bold, social, goal-first money app where every screen reframes spending as a story you're writing with your friends, not a ledger you're auditing.",
      result: "+62% day-7 retention vs. the leading incumbent in unmoderated tests.",
    },
    tags: ["0→1", "Mobile", "Gen-Z", "Behavioral design"],
    hero: "linear-gradient(135deg, oklch(0.58 0.165 35) 0%, oklch(0.78 0.12 70) 100%)",
    cover: coverFinanceZ,
    liveUrl:
      "https://www.figma.com/proto/woGOzKqgWIa8nZYHAkZlPK/FinZ-final?node-id=493-487&p=f&viewport=-276%2C50%2C0.14&t=BoFdNvRSbZbPlLNK-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=493%3A424&show-proto-sidebar=1",
    liveLabel: "Open Figma prototype",
    hasFullCase: true,
  },
  {
    slug: "aroma-labs",
    title: "The Aroma Labs",
    kicker:
      "A data-driven ERP + customer app for a multi-outlet F&B brand, cut ops friction and unlocked scalable growth.",
    year: "2025",
    role: "Product Designer · ERP + Consumer",
    status: "Done",
    tldr: {
      problem:
        "A growing multi-outlet F&B brand was running ops on WhatsApp and spreadsheets, owners couldn't see what was happening across stores in real time.",
      solution:
        "A two-sided system: an ERP for ops + inventory + staff, and a consumer app for ordering and loyalty, sharing one design language and one source of truth.",
      result: "Enabled real-time cross-outlet decisions; rolled out to all locations.",
    },
    tags: ["ERP", "F&B", "0→1", "Two-sided"],
    hero: "linear-gradient(135deg, oklch(0.92 0.05 60) 0%, oklch(0.68 0.13 30) 100%)",
    cover: coverAroma,
    liveUrl: "https://restaurant-dashboard-uxscape.vercel.app",
    liveLabel: "View live dashboard",
    hasFullCase: true,
  },
  {
    slug: "boult-audio",
    title: "Boult Audio",
    kicker: "Rebuilding a D2C audio store around the 9-second decision moment.",
    year: "2024",
    role: "UX Designer · Revamp",
    status: "In progress",
    tldr: {
      problem:
        "Cart abandonment sat at 71%, users couldn't tell three earbud SKUs apart on a 5.5\" screen.",
      solution:
        "A comparison-first PDP that surfaces the one spec each persona actually cares about, in plain language.",
      result: "Add-to-cart projected +28% in usability test (n=12); shipping to engineering Q1.",
    },
    tags: ["E-commerce", "Revamp", "Research"],
    hero: "linear-gradient(135deg, oklch(0.25 0.02 60) 0%, oklch(0.45 0.08 40) 100%)",
    cover: coverBoult,
    hasFullCase: true,
  },
  {
    slug: "aston-martin",
    title: "Aston Martin",
    kicker: "A microsite that earns the badge, restraint, weight, silence.",
    year: "2024",
    role: "UX Designer · Microsite",
    status: "Done",
    tldr: {
      problem: "Showrooms wanted a digital companion that wouldn't cheapen a £200k brand.",
      solution:
        "A single-scroll narrative built around negative space and one hero moment per panel.",
      result: "Used as the in-showroom tablet experience across 3 dealerships.",
    },
    tags: ["Brand UX", "Microsite"],
    hero: "linear-gradient(135deg, oklch(0.2 0.01 240) 0%, oklch(0.35 0.04 220) 100%)",
    cover: coverAston,
    liveUrl: "https://amf1test.imocha.io",
    liveLabel: "Visit live site",
    hasFullCase: true,
  },
  {
    slug: "ericsson-india",
    title: "Ericsson India",
    kicker: "Telecom infrastructure storytelling for a non-technical audience.",
    year: "2024",
    role: "UX Designer · Microsite",
    status: "Done",
    tldr: {
      problem: "Ericsson's 5G rollout story was buried under PDFs nobody opened.",
      solution:
        "A scroll-driven microsite that makes radio access networks legible to policy makers.",
      result: "Featured in two industry briefings; bounce rate dropped from 68% to 31%.",
    },
    tags: ["B2B", "Microsite", "Storytelling"],
    hero: "linear-gradient(135deg, oklch(0.4 0.13 240) 0%, oklch(0.58 0.12 200) 100%)",
    cover: coverEricsson,
    liveUrl: "https://edgeacademia-ericsson.imocha.io",
    liveLabel: "Visit live site",
    hasFullCase: true,
  },
  {
    slug: "trident-india",
    title: "Trident India",
    kicker: "One stack, two audiences, internal ops and external partners.",
    year: "2024",
    role: "UX Designer",
    status: "Done",
    tldr: {
      problem: "Two microsites maintained by two teams, drifting apart visually and editorially.",
      solution: "A shared design system with audience-aware modules that reuse 80% of components.",
      result: "Cut design-to-dev handoff from 9 days to 3.",
    },
    tags: ["Design system", "B2B"],
    hero: "linear-gradient(135deg, oklch(0.48 0.13 145) 0%, oklch(0.62 0.11 165) 100%)",
    cover: coverTrident,
    hasFullCase: true,
  },
  {
    slug: "loreal-dashboard",
    title: "L'Oréal · PowerBI",
    kicker: "Making a 40-tab marketing dashboard answer one question fast.",
    year: "2024",
    role: "UX for Data",
    status: "Done",
    tldr: {
      problem: "The brand team opened the dashboard, got overwhelmed, and went back to Excel.",
      solution:
        "Reorganized around three jobs-to-be-done, hid everything else behind progressive disclosure.",
      result: "Daily active users on the dashboard 3×'d over six weeks.",
    },
    tags: ["Data viz", "Dashboard"],
    hero: "linear-gradient(135deg, oklch(0.32 0.09 350) 0%, oklch(0.55 0.13 25) 100%)",
    cover: coverLoreal,
    hasFullCase: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
