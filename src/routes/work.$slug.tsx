import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getProject, projects } from "@/lib/projects";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title}, Kaushik Patil, Case Study` },
          { name: "description", content: loaderData.project.tldr.problem },
          { property: "og:title", content: `${loaderData.project.title} · Case Study` },
          { property: "og:description", content: loaderData.project.tldr.solution },
        ]
      : [],
  }),
  component: CaseStudy,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <p className="font-serif text-5xl mb-4">Case not found.</p>
        <Link to="/" className="underline decoration-accent">
          Back to work
        </Link>
      </div>
    </div>
  ),
});

function CaseStudy() {
  const { project } = Route.useLoaderData();
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Title block */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <Link to="/" className="text-sm text-muted-foreground hover:text-accent">
          ← All work
        </Link>
        <p className="mt-10 text-xs uppercase tracking-widest text-muted-foreground">
          {project.tags.join(" · ")}
        </p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-[0.95]">{project.title}</h1>
        <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl leading-snug">
          {project.kicker}
        </p>
        {project.slug === "kitchen-iq" && (
          <div className="mt-8 border-l-2 border-accent pl-4 py-2 text-sm text-muted-foreground bg-secondary/20 rounded-r-lg max-w-3xl">
            This is a self-initiated product concept I'm designing while building the business case
            and API access in parallel. The case study documents the design process and strategic
            thinking — not a shipped product.
          </div>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm px-5 py-3 rounded-full bg-foreground text-background hover:bg-accent transition-colors"
          >
            {project.liveLabel ?? "View live"} ↗
          </a>
        )}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm border-t border-border pt-6">
          <Meta label="Role" value={project.role} />
          <Meta label="Year" value={project.year} />
          <Meta label="Status" value={project.status} />
          <Meta label="Output" value={project.hasFullCase ? "Full case study" : "Snapshot"} />
        </div>
      </section>

      {/* Hero visual */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="aspect-[16/9] md:aspect-[2.2/1] rounded-3xl overflow-hidden">
          <img
            src={project.cover}
            alt={`${project.title} cover`}
            width={1600}
            height={900}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* TL;DR */}
      <section className="mx-auto max-w-5xl px-6 mt-16">
        <div className="rounded-3xl border-2 border-foreground bg-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs uppercase tracking-widest font-medium">
              TL;DR
            </span>
            <span className="text-xs text-muted-foreground">For the 90-second skim</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TldrCell label="The problem I inherited" body={project.tldr.problem} />
            <TldrCell label="What I shipped" body={project.tldr.solution} />
            <TldrCell label="The number that moved" body={project.tldr.result} accent />
          </div>
        </div>
      </section>

      {/* Full arc, only for case studies with depth */}
      {project.hasFullCase ? (
        <FullArc project={project} />
      ) : (
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="font-serif text-3xl leading-snug">
            Full write-up coming. Want the deck early?{" "}
            <a
              href="mailto:workkwithkaushik@gmail.com"
              className="text-accent underline underline-offset-4"
            >
              Email me
            </a>{" "}
            and I'll walk you through it.
          </p>
        </section>
      )}

      {/* More work */}
      <section className="mx-auto max-w-6xl px-6 py-24 border-t border-border">
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Keep reading</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {others.map((p) => (
            <Link
              key={p.slug}
              to="/work/$slug"
              params={{ slug: p.slug }}
              className="group rounded-3xl overflow-hidden border border-border hover:border-foreground transition-colors bg-card"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={p.cover}
                  alt={`${p.title} cover`}
                  loading="lazy"
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.role}</p>
                <h3 className="font-serif text-3xl mt-1 group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">{p.kicker}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p>{value}</p>
    </div>
  );
}

function TldrCell({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <p className={`leading-snug ${accent ? "font-serif text-2xl text-accent" : "text-base"}`}>
        {body}
      </p>
    </div>
  );
}

// Generic full-arc storytelling: tension → research insight → pivot → outcome
function FullArc({ project }: { project: ReturnType<typeof getProject> & {} }) {
  const arcs: Record<string, ArcSection[]> = {
    "kitchen-iq": [
      {
        kicker: "01 · The tension",
        title: "An ₹1.1B market making ₹1.1B worth of guesses.",
        body: "India's cloud kitchen industry is one of the fastest-growing in the world, 18,000+ brands, 70,000+ Swiggy-listed outlets, ₹380M of VC poured in last year alone. And yet 60% of new kitchens fail inside 18 months. Not because the food is bad. Because operators pick the wrong cuisine, in the wrong pincode, at the wrong price, and they pick it on gut feel.",
        pull: "Rebel Foods spends ₹3-4 Cr a year on an in-house analytics team to answer questions every operator needs answered.",
      },
      {
        kicker: "02 · The insight",
        title: "Swiggy quietly opened the door. Nobody walked through it for operators.",
        body: "When Swiggy's Builders Club shipped MCP APIs for restaurant discovery, menus, pricing, and area-level demand, it changed what was possible overnight. The most valuable food-tech dataset in India was suddenly available, but Swiggy can't sell it to operators (conflict of interest), and small ops teams can't engineer their way to it. There's a clear, defensible wedge between the data and the people who need it.",
        pull: "Three lenses became the entire product: Demand, Price, Competitive. Everything else is a feature underneath one of them.",
      },
      {
        kicker: "03 · The design problem",
        title: "Bloomberg Terminal energy, without the Bloomberg learning curve.",
        body: "Operators aren't analysts. They're chefs and ops leads who'll abandon a dashboard the moment it asks them to learn a query language. I'm designing KitchenIQ around one home screen, a pincode-level demand heatmap, that answers the highest-stakes question (where is unmet demand?) in the first 10 seconds, and lets power users drill into Price and Competitive lenses from there.",
        pull: "Flagship feature: the 'Gap Score', demand ÷ supply, color-coded red→green. One number an operator can defend a board decision with.",
      },
      {
        kicker: "04 · What's being built",
        title: "Three lenses, one map, and a free public hook.",
        body: "Core surfaces in design: the Demand Heatmap (flagship), Price Intelligence (real-time competitive benchmarks), Competitive Intelligence (rating momentum, discount tracking, new entrants), and an Expansion Readiness Scorer that turns four signals into a 0-100 score per pincode. A free public 'Cuisine Gap Finder' tool seeds top-of-funnel, enter a pincode, get the top 3 underserved cuisines, no login.",
        pull: "Starter ₹3,999/mo · Pro for multi-kitchen brands · Enterprise API tier for Rebel Foods-class operators.",
      },
      {
        kicker: "05 · Where it's going",
        title: "Months 1-3: data pipeline live, 10 beta operators on the heatmap.",
        body: "The model targets 100 paying brands in Year 1 (₹6 Cr ARR modeled) and 1,000+ by Month 36 on a ₹1,800 Cr TAM estimate. These are projections — not actuals. The strategic thesis behind them: a time-series moat. Every day KitchenIQ runs, the historical dataset compounds. A competitor starting later only ever sees today.",
      },
    ],
    "finance-z": [
      {
        kicker: "01 · The tension",
        title: "We were building a calculator. They wanted a mirror.",
        body: "The brief said 'budgeting app for Gen-Z, gamified.' I sat with 14 users in the first week. Not one of them used the word 'budget' unprompted. They said 'vibe-check my month,' 'am I cooked,' 'where did it go.' The product team was solving an accounting problem. The users had an identity problem.",
        pull: "73% of Gen-Z users abandoned the leading competitors within 14 days.",
      },
      {
        kicker: "02 · The insight that broke the brief",
        title:
          "Streaks don't work because people are competitive. They work because they tell a story.",
        body: "Half the team wanted Duolingo-style streaks. I pushed back: streaks built on punishment (lose the streak, feel bad) drive churn after the first slip. We mapped a different model, streaks as narrative chapters. Miss a day and the app doesn't shame you, it asks 'what happened?' and folds it into the story.",
        pull: "I killed the leaderboard feature in week three. It tested 4.1/5 in surveys and 2.2/5 in actual use.",
      },
      {
        kicker: "03 · The pivot",
        title: "From dashboard-first to story-first.",
        body: "The first prototype opened on a pie chart. Engagement: 11 seconds median. The second opened on a single sentence, 'You spent ₹4,200 on things that made you feel good this week.' Engagement: 47 seconds, and people scrolled. We rebuilt the entire IA around the home screen being a paragraph, not a panel.",
        pull: "Three of five tested users said 'this feels like reading my own diary.' That was the brief from then on.",
      },
      {
        kicker: "04 · What shipped, what moved",
        title: "Retention is a design problem, not a marketing one.",
        body: "We designed and tested three core surfaces: the daily paragraph, the streak chapter, and a gentle nudge inbox that replaced push spam. In unmoderated prototype tests (n=24), D7 retention intent ran 62% higher vs. the leading incumbent. Notification opt-out dropped 41% vs. a control flow. This was a concept project — but the test results are the brief I'd take into a real beta.",
        pull: "+62% D7 retention intent (prototype test, n=24) · −41% notification opt-out vs. control · 4.7 min avg session · Concept project",
      },
      {
        kicker: "05 · What I'd do differently",
        title: "I shipped the streak before the recovery flow.",
        body: "Two weeks post-launch, users who broke their streak churned harder than users who never started one. The 'what happened?' recovery flow existed in Figma but not in code. I should have blocked launch on it. I wrote it into our team's definition-of-done the next sprint.",
      },
    ],
    "aroma-labs": [
      {
        kicker: "01 · The tension",
        title:
          "The owner knew every customer's name. He had no idea what his Tuesday inventory was.",
        body: "The Aroma Labs runs a multi-outlet F&B brand built on warmth, hand-rolled recipes, regulars, vibe. But behind the counter the system was WhatsApp groups, three spreadsheets, and an end-of-day call to count milk cartons. Scaling past four outlets was breaking the thing that made it special.",
        pull: "The founders weren't asking for software. They were asking to get their Sundays back.",
      },
      {
        kicker: "02 · The insight",
        title: "An ERP and a customer app aren't two products. They're one conversation.",
        body: "The instinct was to ship the ops dashboard first and bolt loyalty on later. I pushed for the opposite framing: every consumer action (an order, a redemption, a complaint) is an ops event, and every ops decision (an 86'd item, a staff swap) shows up in the customer's next visit. Treat them as one system or build the same bug twice.",
        pull: "I co-wrote the data model with the engineers before drawing a single screen.",
      },
      {
        kicker: "03 · The pivot",
        title: "Designed for the most-stressed person in the building.",
        body: "Early prototypes assumed the manager would sit with a laptop. Field visits killed that fantasy in an hour. The manager is on the floor, one-handed, often during a rush. We rebuilt the ERP for thumb-zone use on a phone, long-press for power actions, hero numbers above the fold, no nested menus on the critical paths.",
        pull: "If a manager needs more than 2 taps to 86 an item, they'll just shout across the kitchen instead. We tested for shouting-rate.",
      },
      {
        kicker: "04 · What shipped, what moved",
        title: "One stack, two front-ends, one source of truth.",
        body: "We shipped the ERP and the consumer app on a shared design system and shared backend. Owners can now see live revenue, inventory, and staffing across every outlet from a single screen. Customers get a loyalty experience that remembers their last order. The brand kept its warmth. The ops chaos didn't follow it to scale.",
        pull: "All outlets live · Real-time cross-store visibility · WhatsApp ops reporting eliminated · Client confirmed: owners close the day on a phone, not a spreadsheet",
      },
      {
        kicker: "05 · What I learned",
        title: "Operational software doesn't have to look operational.",
        body: "Most ERPs are designed to make the user feel like they're using an ERP. We made a deliberate choice, same warm type, same generous spacing, same restraint as the consumer app, because the people running the kitchen deserve software that respects them too.",
      },
    ],
    "boult-audio": [
      {
        kicker: "01 · The tension",
        title: "The site looked fine. The funnel was bleeding.",
        body: "Boult's PDPs were Shopify-default-pretty. The number that mattered, add-to-cart, sat at a quiet, terrible 7.3%. The instinct in the room was a redesign. I asked for the session recordings instead. We watched 40. Forty.",
        pull: "Cart abandonment: 71% · Time on PDP before bounce: 9 seconds",
      },
      {
        kicker: "02 · The insight",
        title: "Three near-identical SKUs is a comparison problem, not a presentation problem.",
        body: "Boult sells 14 earbud models. On a phone, the difference between the Z40, Z40 Pro, and Z60 is a 2-letter suffix and a ₹400 jump. Users were opening three tabs and giving up. The PDP wasn't the problem. The absence of a sane compare flow was.",
        pull: "0 of 40 sessions reached the 'compare' page. It existed. Nobody could find it.",
      },
      {
        kicker: "03 · The pivot",
        title: "Compare-by-default, not compare-on-demand.",
        body: "I moved comparison into the PDP itself: a sticky strip at the top showing 'vs. Z40 Pro · vs. Z60' with the one spec that actually differs in human language ('30% longer battery, same sound'). The product team pushed back, 'won't this distract from the buy button?' Usability tests said the opposite. The buy button was the relief at the end of the question.",
        pull: "I rewrote spec sheets from 'Bluetooth 5.3 / 60ms latency' to 'Calls don't lag. Period.' Engineers winced. Buyers nodded.",
      },
      {
        kicker: "04 · What shipped, what moved",
        title: "Projected wins, validated friction.",
        body: "The new PDP is in engineering for a Q1 ship. In moderated tests (n=12) the redesigned flow lifted task-success on 'pick the right earbud for my use case' from 4/12 to 11/12. Add-to-cart in the unmoderated prototype came in at a projected +28%. We're A/B testing post-launch.",
        pull: "+28% projected ATC · Task success 33% → 92% · −4.2s to decision",
      },
      {
        kicker: "05 · What I learned",
        title: "The bravest design move was deleting a section.",
        body: "We cut the 'related products' carousel from the PDP entirely. The data said it drove 1.1% of conversions and 14% of bounce. Deleting it felt scarier than redesigning everything else combined. It shipped. Nobody noticed except the funnel.",
      },
    ],
    "aston-martin": [
      {
        kicker: "01 · The brief",
        title: "A careers portal that had to feel like a paddock pass, not a job form.",
        body: "Aston Martin Aramco Formula One Team wanted to modernize recruitment for engineering and business talent across the grid. The legacy flow leaked candidates at every step, long single-page forms, no mobile pass, generic copy that could have been any HR portal. The remit: build a candidate experience worthy of a £200M race team without turning the page into a brochure.",
        pull: "Scope: end-to-end UX for registration, login, password flows, and HR-side workflow, live at amf1test.imocha.io.",
      },
      {
        kicker: "02 · Research",
        title: "Three personas. One funnel. Very different fears.",
        body: "Workshops with HR, employer branding, and IT surfaced two non-negotiables: a premium feel and bulletproof data privacy. I interviewed current AMF1 employees, recent hires, and aspiring candidates, then benchmarked F1 and luxury automotive recruitment sites. The legacy form had a 7-section monolith that students, experienced engineers, and business hires all met the same way. They wanted different things and were quitting at different points.",
        pull: "Drop-off was concentrated in two places: 'Academic Qualifications' (students) and 'Industry Experience' (experienced hires).",
      },
      {
        kicker: "03 · The pivot",
        title: "Progressive disclosure, role-branched, single-column.",
        body: "I restructured the registration as a guided stack, Personal → Academic → Professional → Industry → Attachments → Outreach, with role-aware branching so a graduate never sees 'Years in Motorsport.' Every section is a single column, every field has microcopy, every error fires inline. The password flows got the same treatment: one input to request a reset, plain-language confirmation, no decorative noise.",
        pull: "WCAG 2.1 compliance was a launch gate, not a polish item. Every component shipped keyboard-navigable and screen-reader friendly.",
      },
      {
        kicker: "04 · What shipped",
        title: "A scalable UI kit, a pixel-perfect handoff, a self-serve HR.",
        body: "I delivered annotated flows, a component library covering every state, and prototype links the dev team used as the source of truth through sprints. I also wrote the HR documentation, they can now add roles, edit FAQs, and adjust workflow without a designer in the loop. Subtle F1-motif backgrounds and persistent Aston Martin / Aramco lockups carry the brand without ever cheapening it.",
        pull: "Completion rate up post-launch · Support tickets for password recovery down · Stronger employer brand signal at the top of funnel.",
      },
      {
        kicker: "05 · What I learned",
        title: "Restraint is a brand asset when the brand is restraint.",
        body: "The instinct on a marquee client is to over-design, gradients, animation, hero video. AMF1's brand is measured. The right move was to give the user space, plain language, and a feeling that nothing here is going to waste their time. That's what 'premium' meant on this project.",
      },
    ],
    "ericsson-india": [
      {
        kicker: "01 · The brief",
        title: "A six-month learning journey for students across 12 markets.",
        body: "EricssonEdge Academia is a multi-country talent pipeline, pre-final-year students discover the program, confirm eligibility, register, clear a qualifying exam, complete modules in 5G/AI/automation/telecom, and earn accreditation. The portal had to communicate that staged journey clearly, scale across SEA, Oceania, and India, and feed program ops and university partners with the reporting they needed.",
        pull: "Funnel KPIs: qualified registrations → exam participation → pass rate → learning completion → accreditation.",
      },
      {
        kicker: "02 · Research",
        title: "Students didn't need persuasion. They needed proof of where they were.",
        body: "Discovery workshops with HR, university partnerships, talent marketing, and regional program managers surfaced a sharp insight: the legacy comms made the program sound interesting but never told a candidate where they were in it. Drop-off clustered at the gap between 'I registered' and 'now what?' I mapped the four-stage journey explicitly, Register → Qualifying Exam → Learning Courses → Accreditation, and made it the spine of the IA.",
        pull: "Regional program managers couldn't pull a clean funnel report. That was a UX problem disguised as an analytics one.",
      },
      {
        kicker: "03 · The pivot",
        title: "Stage-aware homepage, not a marketing homepage.",
        body: "The first version opened with brand storytelling. Tests showed registered students were bouncing because they had to dig to find 'where do I go next.' I rebuilt the homepage to detect status and lead with the next action, register, sit the exam, resume coursework, claim accreditation. Marketing content moved underneath. Consent and data policy got first-class treatment for legal/compliance across 12 jurisdictions.",
        pull: "One screen, four possible answers. The right one for the user in front of it.",
      },
      {
        kicker: "04 · What shipped",
        title: "A scaled portal, partner-ready reporting, weekly funnel reviews.",
        body: "Shipped surfaces: program overview with eligibility logic, registration with regional branching, qualifying-exam scheduling, learning hub, accreditation claim, and a partner-side dashboard for universities and program ops. Post-launch we ran weekly measurement reviews and tuned copy, CTAs, and reminder cadence against funnel data.",
        pull: "Cleaner funnel, faster registrations, partner reporting that program ops actually used.",
      },
      {
        kicker: "05 · What I learned",
        title: "A multi-country product is a multi-tone product.",
        body: "The same screen reads differently in Jakarta, Bengaluru, and Sydney. We didn't translate, we localized tone, examples, and the eligibility language so a student in each market felt the program was talking to them. That was 60% of the post-launch lift.",
      },
    ],
    "trident-india": [
      {
        kicker: "01 · The brief",
        title: "Hire at scale, in two languages, with dignity.",
        body: "Trident's Karamyogi and Takshashila initiatives recruit and uplift youth across India, multi-state drives, multi-region plants, with deliberate focus on women and sports-background candidates. The microsite had to serve discovery, eligibility, registration, assessment, and culture storytelling, in English and Hindi, while aligning with the 'Earn, Learn, Grow' philosophy and a wider nation-building narrative.",
        pull: "One stack, two audiences: applicants on the outside, talent acquisition and plant HR on the inside.",
      },
      {
        kicker: "02 · Research",
        title: "Bilingual isn't a toggle. It's a content model.",
        body: "Stakeholder workshops with CHRO, talent acquisition, corp comms, plant HR, and ops surfaced the real risk: Hindi content drifting from English content, or worse, reading like a translation. I worked with corp comms to write source content in both languages in parallel, then designed components that assumed either language could be the primary at any time, type ramps, line-height, and form fields all sized for Devanagari.",
        pull: "Most 'bilingual' sites are an English site with a Hindi mode. We built one site that happens to render in two languages.",
      },
      {
        kicker: "03 · The pivot",
        title: "One design system, audience-aware modules.",
        body: "The original ask was two microsites, one external (applicants), one internal (TA + plant HR). I pushed for one design system with audience-aware modules that reuse ~80% of components. The external view leads with stories of Karamyogis on the floor; the internal view leads with funnel health and regional conversion. Same brand, same components, two narratives.",
        pull: "Design-to-dev handoff dropped from 9 days to 3 once we stopped maintaining two trees.",
      },
      {
        kicker: "04 · What shipped",
        title: "A portal that recruits, reports, and tells the story.",
        body: "Shipped: discovery pages with eligibility logic, bilingual registration with regional routing, assessment scheduling, applicant tracking for plant HR, and a storytelling layer for Karamyogi journeys. Source attribution lets the team see which campaigns drive qualified registrations from priority segments (women, sports-background).",
        pull: "Qualified registrations up, regional conversion clearer, priority-segment share visible for the first time.",
      },
      {
        kicker: "05 · What I learned",
        title: "Design systems pay for themselves the second time you use them.",
        body: "The argument for one stack instead of two felt expensive at the start of the project, more upfront design, more component thinking. By month three the team was shipping new drive pages in a day instead of a week, and the internal/external visual drift that had plagued past initiatives just didn't happen.",
      },
    ],
    "loreal-dashboard": [
      {
        kicker: "01 · The tension",
        title: "A 40-tab Power BI dashboard nobody opened twice.",
        body: "L'Oréal's brand team had a powerful analytics environment, every campaign, every market, every SKU. They opened it once, got buried under filter panes and tab strips, and went back to Excel. The dashboard was technically complete and operationally dead.",
        pull: "Daily active users on the dashboard: 11% of the team it was built for.",
      },
      {
        kicker: "02 · Research",
        title: "Three jobs, not forty tabs.",
        body: "I shadowed seven brand managers across two markets. Despite the 40-tab structure, every session collapsed into one of three questions: 'How is my campaign tracking this week?', 'Which SKU/market is anomalous?', 'What do I tell my MD on Monday?' The dashboard was organized around data sources. The users worked around questions.",
        pull: "Median time to find an answer in the legacy dashboard: 4 minutes 12 seconds. Median time in Excel: 38 seconds.",
      },
      {
        kicker: "03 · The pivot",
        title: "Three landing views, progressive disclosure for everything else.",
        body: "I restructured the dashboard around the three jobs, Campaign Tracker, Anomaly Scanner, MD Monday Brief. Each is a single screen that answers the question in under 10 seconds, with drill-downs hidden behind progressive disclosure. The 40 original tabs are still there for power users, behind one 'All views' affordance. Visual hierarchy got rebuilt around a single hero metric per view; secondary KPIs sit underneath in a calmer typographic ramp.",
        pull: "We deleted nothing. We just stopped showing everything at once.",
      },
      {
        kicker: "04 · What shipped",
        title: "A dashboard people open on purpose.",
        body: "Shipped: three reorganized landing views, a unified filter model that persists across views, contextual tooltips replacing the legacy data dictionary, and a 'share this view' affordance for the Monday brief workflow. Power BI's defaults fought us on type and spacing, I built a design-token-driven template that future dashboards inherit so the brand team gets one visual language across reports.",
        pull: "Daily active users 3×'d over six weeks · Median time-to-answer down from 4m12s to under 30s.",
      },
      {
        kicker: "05 · What I learned",
        title: "Data viz is information architecture wearing a coat.",
        body: "The instinct on a dashboard project is to argue about chart types. The real work was naming the three jobs out loud and being willing to push secondary data off the first screen. Once that decision was made, every chart choice underneath it got obvious.",
      },
    ],
  };

  const sections = arcs[project.slug] ?? [];

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      {sections.map((s, i) => (
        <div key={i} className="mb-24 last:mb-0">
          <section>
            <p className="text-xs uppercase tracking-widest text-accent mb-4">{s.kicker}</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-6">{s.title}</h2>
            <p className="text-lg leading-relaxed text-foreground/85">{s.body}</p>
            {s.pull && (
              <blockquote className="mt-8 pl-6 border-l-2 border-accent font-serif text-2xl md:text-3xl leading-snug text-foreground">
                {s.pull}
              </blockquote>
            )}
          </section>
          {renderPlaceholders(project.slug, i)}
        </div>
      ))}
    </article>
  );
}

function ImagePlaceholder({ alt, caption }: { alt: string; caption: string }) {
  return (
    <div className="group rounded-3xl overflow-hidden border border-border bg-card p-4 my-8">
      <div className="aspect-[4/3] rounded-2xl bg-secondary/35 border-2 border-dashed border-border flex flex-col items-center justify-center p-6 text-center transition-colors group-hover:border-foreground/30">
        <span className="text-3xl text-muted-foreground/60 mb-2">📸</span>
        <span className="text-xs font-mono text-muted-foreground/80 max-w-[280px] break-words">
          {alt}
        </span>
      </div>
      {caption && (
        <p className="mt-3 text-xs italic text-muted-foreground text-center">{caption}</p>
      )}
    </div>
  );
}

function BrowserPlayground({
  url,
  displayUrl,
  title,
}: {
  url: string;
  displayUrl: string;
  title: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const handleReload = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="my-16 w-full md:w-[120%] md:-translate-x-[8.33%] lg:w-[130%] lg:-translate-x-[11.54%] bg-[#121212] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Browser Mock Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-neutral-900/90 border-b border-neutral-800/80">
        {/* Window controls */}
        <div className="flex items-center gap-1.5 w-1/4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>

        {/* URL Bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 w-2/4 max-w-md bg-neutral-950/80 border border-neutral-800/60 rounded-xl text-neutral-400 text-xs font-mono select-none">
          {/* Secure Lock Icon */}
          <svg
            className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="truncate">{displayUrl}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 w-1/4">
          {/* Reload Button */}
          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-foreground hover:bg-neutral-800 transition-colors"
            title="Reload Playground"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89"
              />
            </svg>
          </button>
          {/* Open Live Button */}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-foreground hover:bg-neutral-800 transition-colors"
            title="Open Live Site in New Tab"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Frame content */}
      <div className="relative aspect-[16/10] md:aspect-[16/9] w-full min-h-[500px] md:min-h-[600px] bg-neutral-950">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 z-10 text-center p-6">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-mono text-neutral-500">Connecting to secure playground...</p>
          </div>
        )}
        <iframe
          key={reloadKey}
          src={url}
          title={title}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}

function FinanceZPlayground() {
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const handleReload = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const figmaEmbedUrl =
    "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FwoGOzKqgWIa8nZYHAkZlPK%2FFinZ-final%3Fnode-id%3D493-424%26p%3Df%26viewport%3D-276%252C50%252C0.14%26t%3DBoFdNvRSbZbPlLNK-1%26scaling%3Dscale-down%26content-scaling%3Dfixed%26starting-point-node-id%3D493%253A424%26show-proto-sidebar%3D1";

  return (
    <div className="my-16 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Device Utility Bar */}
        <div className="w-full flex items-center justify-between px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-t-2xl text-xs text-neutral-400 select-none">
          <div className="flex items-center gap-1.5 font-mono">
            <svg
              className="w-3.5 h-3.5 text-accent flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V7a4 4 0 00-8 0v4c0 2.451.63 4.758 1.748 6.772m0 0l.053.091M13 7v4c0 2.013-.51 3.907-1.417 5.571m.002-11.142A9.003 9.003 0 0120 11v4c0 .874-.118 1.72-.34 2.528m0 0A3.001 3.001 0 0117 21a3 3 0 01-2.224-1.016"
              />
            </svg>
            <span className="font-semibold text-neutral-300">Finance Z Prototype</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReload}
              className="hover:text-foreground transition-colors"
              title="Reload Prototype"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89"
                />
              </svg>
            </button>
            <a
              href="https://www.figma.com/proto/woGOzKqgWIa8nZYHAkZlPK/FinZ-final?node-id=493-424&p=f&viewport=-276%2C50%2C0.14&t=BoFdNvRSbZbPlLNK-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=493%3A424&show-proto-sidebar=1"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
              title="Open Figma in New Tab"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Device Mockup Frame */}
        <div className="relative w-full aspect-[9/19] bg-black border-[10px] border-neutral-900 border-t-[12px] border-b-[12px] rounded-b-3xl shadow-2xl overflow-hidden">
          {/* Speaker / Camera Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-center">
            <div className="w-12 h-1 bg-neutral-800 rounded-full" />
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 z-10 text-center p-6">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-mono text-neutral-500">Loading Figma prototype...</p>
            </div>
          )}

          <iframe
            key={reloadKey}
            src={figmaEmbedUrl}
            title="Finance Z Figma Prototype Playground"
            className="w-full h-full border-none bg-neutral-950"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <p className="mt-4 text-xs italic text-muted-foreground text-center">
          Interactive Figma prototype. Click/tap inside to navigate flows.
        </p>
      </div>
    </div>
  );
}

function renderPlaceholders(slug: string, index: number) {
  if (slug === "finance-z" && index === 2) {
    return <FinanceZPlayground />;
  }

  if (slug === "aroma-labs" && index === 1) {
    return (
      <BrowserPlayground
        url="https://restaurant-dashboard-uxscape.vercel.app/regional/overview"
        displayUrl="restaurant-dashboard-uxscape.vercel.app"
        title="Aroma Labs Live Dashboard Playground"
      />
    );
  }

  if (slug === "aston-martin" && index === 3) {
    return (
      <BrowserPlayground
        url="https://amf1test.imocha.io/"
        displayUrl="amf1test.imocha.io"
        title="Aston Martin Aramco F1 Careers Portal Playground"
      />
    );
  }

  if (slug === "ericsson-india" && index === 3) {
    return (
      <BrowserPlayground
        url="https://edgeacademia-ericsson.imocha.io/"
        displayUrl="edgeacademia-ericsson.imocha.io"
        title="Ericsson Edge Academia Portal Playground"
      />
    );
  }

  if (slug === "trident-india" && index === 3) {
    return (
      <BrowserPlayground
        url="https://tridentkyuat.imocha.io"
        displayUrl="tridentkyuat.imocha.io"
        title="Trident Recruitment Portal Playground"
      />
    );
  }

  return null;
}

type ArcSection = { kicker: string; title: string; body: string; pull?: string };
