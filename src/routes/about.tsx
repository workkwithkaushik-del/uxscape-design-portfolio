import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About, Kaushik Patil" },
      {
        name: "description",
        content:
          "I'm a product designer who believes the brief is the first thing to redesign. Here's how I got here.",
      },
      { property: "og:title", content: "About, Kaushik Patil" },
      {
        property: "og:description",
        content: "Product designer working across SaaS, consumer, and AI workflows.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">About</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-12">
          Design isn't service work. It's <em className="text-accent">argument work.</em>
        </h1>
        <div className="space-y-8 text-lg leading-relaxed text-foreground/85">
          <p>
            I'm Kaushik. I'm a Product Designer with 1+ year of experience working on enterprise
            SaaS platforms, dashboards, and workflow-based systems. I design user flows, wireframes,
            and high-fidelity interfaces that turn complex systems into clear, structured
            experiences.
          </p>
          <p>
            My favorite part of the job is the first week. The week where the team thinks I'm
            wireframing and I'm actually pulling on the loose thread in the brief, the assumption
            nobody named, the metric nobody measured, the user nobody talked to. By Friday the brief
            either holds up or it doesn't, and we know what we're really building.
          </p>
          <p>
            I've shipped end-to-end UX for microsites at iMocha, contributed to AI-UX guidelines,
            built a custom Figma plugin for UX writing, and designed Power BI dashboards for
            L'Oréal. Currently designing analytical applications at Reval Analytical Services.
          </p>
          <p>
            I lead with research, ship with conviction, and treat handoff as a conversation, not a
            Zip file. Outside work I overthink coffee, write in long-form, and quietly study how
            supermarkets lay out their aisles (it's the original UX problem).
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-border grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground uppercase tracking-widest text-xs mb-2">
              Currently
            </p>
            <p>Pune, India · open to product design roles (remote-friendly)</p>
          </div>
          <div>
            <p className="text-muted-foreground uppercase tracking-widest text-xs mb-2">Reach me</p>
            <a
              href="mailto:workkwithkaushik@gmail.com"
              className="underline decoration-accent underline-offset-4"
            >
              workkwithkaushik@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-16">
          <Link to="/" className="text-sm hover:text-accent">
            ← Back to work
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
