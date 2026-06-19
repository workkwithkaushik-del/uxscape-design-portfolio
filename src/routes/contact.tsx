import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useEffect } from "react";
import { useGamification } from "@/hooks/useGamification";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact, Kaushik Patil, UX & Product Designer" },
      {
        name: "description",
        content:
          "Get in touch about full-time roles, freelance work, or a quick design conversation.",
      },
      { property: "og:title", content: "Contact, Kaushik Patil" },
      {
        property: "og:description",
        content:
          "Get in touch about full-time roles, freelance work, or a quick design conversation.",
      },
    ],
  }),
  component: ContactPage,
});

const channels = [
  {
    label: "Email",
    value: "workkwithkaushik@gmail.com",
    href: "mailto:workkwithkaushik@gmail.com",
    note: "Best for briefs, decks, and full-time conversations.",
  },
  {
    label: "LinkedIn",
    value: "/in/kaushik-patil02",
    href: "https://www.linkedin.com/in/kaushik-patil02/",
    note: "Best for a quick intro or to see what I'm working on.",
  },
  {
    label: "Designfolio",
    value: "workkwithkaushik.designfolio.me",
    href: "https://workkwithkaushik.designfolio.me",
    note: "Long-form case studies, deeper than the snapshots here.",
  },
  {
    label: "Résumé",
    value: "Download PDF · one page",
    href: "/resume.pdf",
    download: true,
    note: "Roles, tools, and shipped work at a glance.",
  },
];

function ContactPage() {
  const { trackContactVisit, trackResumeDownload } = useGamification();

  useEffect(() => {
    trackContactVisit();
  }, [trackContactVisit]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Contact · Open to roles & collaborations
        </p>
        <h1 className="mt-6 font-serif text-5xl md:text-7xl leading-[0.95]">
          Let's make something worth opening twice.
        </h1>
        <p className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-2xl leading-snug">
          I reply to every honest message, usually within a day. Pitch a problem, send a brief, or
          just say hi.
        </p>
      </section>

      {/* Channels */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              download={"download" in c && c.download ? "" : undefined}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noreferrer" : undefined}
              onClick={c.label === "Résumé" ? trackResumeDownload : undefined}
              className="group rounded-3xl border border-border hover:border-foreground transition-colors p-6 md:p-8 bg-card"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
              <p className="mt-3 font-serif text-2xl md:text-3xl group-hover:text-accent transition-colors break-words">
                {c.value}
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-snug">{c.note}</p>
              <p className="mt-6 text-xs uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                Open →
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* What I'm open to */}
      <section className="mx-auto max-w-5xl px-6 py-16 border-t border-border">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Right now
            </p>
            <p className="font-serif text-2xl leading-snug">
              Open to full-time Product / UX Design roles, preferably 0→1, SaaS, or AI-adjacent.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Freelance
            </p>
            <p className="font-serif text-2xl leading-snug">
              Selective. Two engagements at a time, scoped in 2-week sprints with a clear
              deliverable.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Just curious
            </p>
            <p className="font-serif text-2xl leading-snug">
              Happy to share notes on enterprise UX, dashboard design, or AI-UX. No agenda needed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-serif text-3xl md:text-4xl leading-snug">
          The fastest way to me is{" "}
          <a
            href="mailto:workkwithkaushik@gmail.com"
            className="text-accent underline underline-offset-4"
          >
            one honest email
          </a>
          . Tell me the problem, I'll tell you if I'm the right designer for it.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Pune, India · Working IST, flexible across time zones
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
