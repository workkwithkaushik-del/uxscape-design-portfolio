import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { projects } from "@/lib/projects";
import { ProfileSection } from "@/components/ProfileSection";
import { useGamification } from "@/hooks/useGamification";
import { FaqSection } from "@/components/FaqSection";
import { Tilt3D } from "@/components/Tilt3D";
import { ScrollFlipCard, Reveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import headshot from "@/assets/portrait-headshot.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaushik Patil, Product Designer who ships outcomes, not screens" },
      {
        name: "description",
        content:
          "Product designer shipping decision-first interfaces for SaaS, F&B, and fintech. Based in Pune, open to full-time roles.",
      },
      { property: "og:title", content: "Kaushik Patil, Product Designer" },
      {
        property: "og:description",
        content:
          "Portfolio of case studies showing the messy middle: problem inherited, assumption challenged, decision shipped.",
      },
    ],
  }),
  component: Home,
});

const skills = {
  "UX Research": [
    "User Interviews",
    "Survey Design",
    "Heuristic Analysis",
    "Persona Building",
    "Journey Mapping",
    "Usability Testing",
    "A/B Testing",
    "Feedback Synthesis",
  ],
  "Product Design": [
    "Wireframing",
    "User Flows",
    "High-Fidelity UI",
    "Interactive Prototyping",
    "Design Systems",
    "Accessibility",
    "Dashboard Design",
    "Data Viz",
  ],
  "AI / UX": [
    "Prompt Engineering",
    "Human-in-the-Loop",
    "Trust, Ethics & Bias",
    "Explainable AI",
    "Conversational UX",
    "Error Recovery",
    "AI Workflow Automation",
  ],
  "Craft & Tools": [
    "Figma",
    "FigJam",
    "Cursor",
    "ChatGPT",
    "Power BI",
    "HTML/CSS",
    "Basic JS",
    "GitHub",
  ],
};

const recommendations = [
  {
    name: "Sagar Darekar",
    role: "Customer Success, iMocha",
    quote:
      "Kaushik possesses a remarkable ability to deeply understand complex client problems. He consistently went beyond surface-level requirements, delving into the core challenges users faced. His wireframes were not just visually clear, but also functionally robust, an excellent foundation for design and development.",
    linkedin: "https://www.linkedin.com/in/darekar-sagar/",
    initials: "SD",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Tushar Pawar",
    role: "UX Design Lead, iMocha",
    quote:
      "Kaushik brings a rare mix of curiosity, technical aptitude, and user-centered thinking. He owned end-to-end UX for key microsites, contributed to AI-UX guidelines, built a custom Figma plugin to streamline UX writing, and designed scalable dashboards in Power BI.",
    linkedin: "https://www.linkedin.com/in/tspawar/",
    initials: "TP",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    name: "Amit Mohod",
    role: "Product Manager, iMocha",
    quote:
      "Pragmatic, fast, opinionated in the way you want a designer to be. Made my PRDs sharper just by asking questions.",
    linkedin: "https://www.linkedin.com/in/amitmohod/",
    initials: "AM",
    gradient: "from-orange-500 to-amber-500",
  },
];

const experience = [
  {
    role: "UI/UX Designer",
    company: "Reval Analytical Services",
    location: "India",
    years: "2025 – Present",
    note: "Designing analytical applications and dashboards for finance and research workflows. Bridging dense data with calm, decision-first interfaces.",
  },
  {
    role: "UX Design Intern",
    company: "iMocha",
    location: "Pune, MH",
    years: "2024",
    note: "Enterprise skill-assessment SaaS. Owned end-to-end UX for microsites, contributed to internal AI-UX guidelines, shipped a custom Figma plugin for UX writing, and designed Power BI dashboards.",
  },
];

function Home() {
  const { trackProjectFilter } = useGamification();
  const [selectedYear, setSelectedYear] = useState<string>("All");

  const sortedProjects = [...projects];
  const filteredProjects = sortedProjects.filter(
    (p) => selectedYear === "All" || p.year === selectedYear,
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-28 relative">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground mb-10">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Open to product design roles · Pune / remote
        </div>
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-9">
            <h1 className="font-serif text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] tracking-tight">
              I design products that earn the <em className="text-accent">second session,</em> not
              just the install.
            </h1>
          </div>
          {/* Floating portrait, parallax on hover, gentle float */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="md:col-span-3 justify-self-end hidden md:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            >
              <Tilt3D max={14} className="rounded-2xl">
                <div className="bg-paper p-2.5 pb-8 rounded-2xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.45)] ring-1 ring-border w-44">
                  <img
                    src={headshot}
                    alt="Kaushik Patil"
                    className="w-full aspect-[4/5] object-cover rounded-lg"
                  />
                  <p className="text-center font-serif italic text-xs text-foreground/70 pt-2">
                    Kaushik · designer
                  </p>
                </div>
              </Tilt3D>
            </motion.div>
          </motion.div>
        </div>
        <div className="mt-12 grid md:grid-cols-12 gap-8 items-end">
          <p className="md:col-span-7 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            I'm <span className="text-foreground">Kaushik Patil</span>, a product designer based in
            Pune. I've shipped ERP systems, consumer apps, and dashboards for F&B, fintech, and
            enterprise clients. I lead with the problem I inherited, the assumption I challenged,
            and what moved because of it.
          </p>
          <div className="md:col-span-5 flex flex-wrap gap-3 md:justify-end">
            <a
              href="#work"
              className="px-5 py-3 rounded-full bg-foreground text-background text-sm hover:bg-accent transition-colors"
            >
              See the work →
            </a>
            <Link
              to="/contact"
              className="px-5 py-3 rounded-full border border-border text-sm hover:border-foreground transition-colors"
            >
              Hire me
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-border bg-foreground text-background overflow-hidden py-5">
        <div className="marquee whitespace-nowrap font-serif text-2xl md:text-3xl flex">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex shrink-0">
              {[
                "Research-led",
                "0→1",
                "Design systems",
                "AI/UX",
                "Behavioral design",
                "B2B SaaS",
                "Consumer",
                "Data viz",
              ].map((w) => (
                <span key={w} className="px-8 flex items-center gap-8">
                  {w} <span className="text-accent">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* PROFILE, who I am, what I love */}
      <ProfileSection />

      {/* WORK */}
      <section id="work" className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Selected work · 2024–26
            </p>
            <h2 className="font-serif text-5xl md:text-6xl max-w-3xl">
              Six case studies. Each one a different fight worth picking.
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs">
            Each one opens with a 60-second TL;DR. Read deeper if the problem grabs you.
          </p>
        </div>

        {/* YEAR FILTER */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs uppercase tracking-widest text-muted-foreground mr-2 font-mono">
            Filter by Year:
          </span>
          {["All", "2026", "2025", "2024", "2023"].map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                if (year !== "All") trackProjectFilter();
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border transition-all ${
                selectedYear === year
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 [perspective:1400px]">
          {filteredProjects.map((p, i) => (
            <ScrollFlipCard
              key={p.slug}
              axis={i % 2 === 0 ? "x" : "y"}
              strength={i === 0 ? 8 : 12}
              className={i === 0 ? "md:col-span-2" : ""}
            >
              <Reveal y={40} delay={i * 0.04}>
                <Link
                  to="/work/$slug"
                  params={{ slug: p.slug }}
                  className="group block h-full rounded-3xl"
                >
                  <Tilt3D max={6} className="h-full w-full">
                    <div className="relative overflow-hidden rounded-3xl border border-border group-hover:border-foreground transition-all bg-card flex flex-col h-full">
                      <div
                        className={`relative ${i === 0 ? "aspect-[16/9] md:aspect-[2.2/1]" : "aspect-[16/10] md:aspect-[4/3]"} overflow-hidden`}
                      >
                        <img
                          src={p.cover}
                          alt={`${p.title} cover`}
                          loading="lazy"
                          width={1600}
                          height={900}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
                        <div className="absolute top-0 inset-x-0 p-5 md:p-8 flex items-center justify-between text-white">
                          <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-90">
                            {p.role}
                          </span>
                          <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-90 text-right">
                            {p.year} · {p.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 md:p-8">
                        <h3 className="font-serif text-2xl sm:text-3xl md:text-5xl leading-tight mb-2 md:mb-3">
                          {p.title}
                        </h3>
                        <p className="text-sm md:text-lg text-muted-foreground leading-snug max-w-xl">
                          {p.kicker}
                        </p>
                        <div className="mt-4 md:mt-6 flex items-center gap-2 text-sm text-foreground/80 group-hover:text-accent group-hover:gap-3 transition-all">
                          Read the case <span>→</span>
                        </div>
                      </div>
                    </div>
                  </Tilt3D>
                </Link>
              </Reveal>
            </ScrollFlipCard>
          ))}
        </div>
      </section>

      {/* PROCESS PROMO */}
      <section className="relative z-10 border-y border-border bg-secondary/50">
        <div className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-12 gap-8 items-center">
          <p className="md:col-span-2 text-xs uppercase tracking-widest text-muted-foreground">
            How I work
          </p>
          <h2 className="md:col-span-8 font-serif text-3xl md:text-5xl leading-tight">
            Final pixels are the easy part. The work is in the{" "}
            <em className="text-accent">conversations that changed the brief.</em>
          </h2>
          <Link
            to="/process"
            className="md:col-span-2 text-sm underline underline-offset-4 decoration-accent hover:text-accent"
          >
            Read my process →
          </Link>
        </div>
      </section>

      {/* SKILLS */}
      <section className="relative z-10 bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            The toolkit
          </p>
          <h2 className="font-serif text-5xl md:text-6xl mb-12">Skills, not buzzwords.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group}>
                <h3 className="font-serif text-2xl mb-5 pb-3 border-b border-border">{group}</h3>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {items.map((s) => (
                    <li key={s} className="flex items-baseline gap-2">
                      <span className="text-accent text-[10px]">▸</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section className="relative z-10 bg-background border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            What collaborators say
          </p>
          <h2 className="font-serif text-5xl md:text-6xl mb-12">Receipts, not testimonials.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recommendations.map((r) => (
              <figure
                key={r.name}
                className="bg-card rounded-2xl p-8 border border-border flex flex-col justify-between"
              >
                <blockquote className="font-serif text-2xl leading-snug mb-6">
                  "{r.quote}"
                </blockquote>
                <figcaption className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border ring-2 ring-background">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${r.gradient} text-white font-mono text-xs font-bold`}
                      >
                        {r.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div className="font-medium flex items-center gap-1.5">
                        {r.name}
                        {r.linkedin && (
                          <a
                            href={r.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-accent transition-colors"
                            title={`${r.name}'s LinkedIn Profile`}
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{r.role}</div>
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="relative z-10 bg-background border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Where I've worked
          </p>
          <h2 className="font-serif text-5xl md:text-6xl mb-12">Experience.</h2>
          <div className="divide-y divide-border border-y border-border">
            {experience.map((e) => (
              <div
                key={e.role + e.company}
                className="grid md:grid-cols-12 gap-4 py-8 items-baseline"
              >
                <div className="md:col-span-2 text-sm text-muted-foreground tabular-nums">
                  {e.years}
                </div>
                <div className="md:col-span-4">
                  <div className="font-serif text-2xl">{e.company}</div>
                  <div className="text-sm text-muted-foreground">{e.location}</div>
                </div>
                <div className="md:col-span-2 text-sm">{e.role}</div>
                {e.note && (
                  <p className="md:col-span-4 text-sm text-muted-foreground leading-relaxed">
                    {e.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <SiteFooter />
    </div>
  );
}
