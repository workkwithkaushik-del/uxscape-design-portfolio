import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useGamification } from "@/hooks/useGamification";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Process, Kaushik Patil" },
      {
        name: "description",
        content: "How I move from a vague brief to a defended decision. Five stages, no jargon.",
      },
      { property: "og:title", content: "Process, Kaushik Patil" },
      { property: "og:description", content: "Re-frame, research, prototype, ship, learn." },
    ],
  }),
  component: Process,
});

const stages = [
  {
    n: "01",
    title: "Re-frame the brief",
    body: "Most briefs are 80% right and 20% load-bearing wrong. I spend week one asking what assumption is doing the heavy lifting. The output is a written one-page re-brief everyone signs off on.",
    deliv: "Re-framed brief · Stakeholder map · Risk log",
  },
  {
    n: "02",
    title: "Talk to humans, not personas",
    body: "I'd rather have 6 messy interviews than a 600-person survey. I synthesize live with the team in the room, the team that watches the interview ships better than the team that reads the report.",
    deliv: "Interview tapes · Insight wall · Re-prioritized backlog",
  },
  {
    n: "03",
    title: "Prototype the decision, not the polish",
    body: "I build the cheapest possible thing that tests the riskiest assumption. Sometimes that's Figma. Sometimes it's a Notion doc. Sometimes it's a fake door A/B in production.",
    deliv: "Clickable prototype · Hypothesis doc · Test plan",
  },
  {
    n: "04",
    title: "Ship with the engineers, not at them",
    body: "I sit in the standup. I review the PR. I write the QA spec. The handoff is a conversation that started in week one and never ended.",
    deliv: "Hi-fi screens · Specced components · QA checklist",
  },
  {
    n: "05",
    title: "Learn out loud",
    body: "Two weeks after ship I write the postmortem, what moved, what didn't, what I'd do differently. The doc gets shared. Nobody gets blamed. The team gets sharper.",
    deliv: "Postmortem doc · Updated component library · Next bet",
  },
];

function Process() {
  const { scrollYProgress } = useScroll();
  const { trackProcessRead } = useGamification();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.8) {
      trackProcessRead();
    }
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Process</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] max-w-4xl">
          A method, not a <em className="text-accent">methodology.</em>
        </h1>
        <p className="mt-8 text-lg text-muted-foreground max-w-2xl">
          No double-diamond posters. No 47-step framework. Here's what actually happens between the
          kickoff and the ship.
        </p>

        <div className="mt-20 space-y-12">
          {stages.map((s) => (
            <div
              key={s.n}
              className="grid md:grid-cols-12 gap-6 pb-12 border-b border-border last:border-0"
            >
              <div className="md:col-span-2">
                <p className="font-serif text-5xl text-accent">{s.n}</p>
              </div>
              <div className="md:col-span-7">
                <h2 className="font-serif text-3xl md:text-4xl mb-3">{s.title}</h2>
                <p className="text-foreground/85 leading-relaxed">{s.body}</p>
              </div>
              <div className="md:col-span-3 text-sm">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Deliverables
                </p>
                <p className="text-muted-foreground">{s.deliv}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <Link to="/" className="text-sm hover:text-accent">
            ← Back to work
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
