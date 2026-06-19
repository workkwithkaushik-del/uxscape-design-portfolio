import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ScrollReveal";
import { useGamification } from "@/hooks/useGamification";

const faqs = [
  {
    q: "What kind of work are you taking on right now?",
    a: "Full-time product / UX roles, ideally 0→1, B2B SaaS, dashboards, or AI-adjacent surfaces. I also pick up a small number of focused freelance engagements per quarter when the brief is interesting.",
  },
  {
    q: "Where are you based, and do you work remotely?",
    a: "Pune, India. I work remotely with teams across IST, CET, and US timezones, and I'm happy to relocate for the right team.",
  },
  {
    q: "What's your design process actually look like?",
    a: "First week is for finding the load-bearing assumption nobody named. Then research, framing, IA, flows, prototype, test, ship, measure. I treat hand-off as a conversation, not a Zip file.",
  },
  {
    q: "Do you only design, or can you build too?",
    a: "Primarily a designer. I write HTML/CSS, basic JS, and I'm comfortable in Cursor and GitHub, enough to prototype, hand off cleanly, and review PRs for design fidelity.",
  },
  {
    q: "What tools do you live in?",
    a: "Figma and FigJam for the bulk of it. Cursor and ChatGPT for thinking and prototyping. Power BI for data work. Notion and Linear for everything else.",
  },
  {
    q: "How do we start working together?",
    a: "Send a note from the contact page with the problem you're trying to solve. I reply to every honest message, usually within a day.",
  },
];

function Item({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(i === 0);
  const { trackFaqOpen } = useGamification();

  const handleToggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next) {
        trackFaqOpen();
      }
      return next;
    });
  };

  return (
    <Reveal y={24} delay={i * 0.04}>
      <div className="border-b border-border">
        <button
          onClick={handleToggle}
          className="w-full py-7 flex items-start gap-6 text-left group"
          aria-expanded={open}
        >
          <span className="font-serif text-accent tabular-nums text-lg pt-1 w-10 shrink-0">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 font-serif text-2xl md:text-3xl leading-snug group-hover:text-accent transition-colors">
            {q}
          </span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl text-muted-foreground group-hover:text-accent font-light leading-none pt-1"
          >
            +
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="pl-16 pr-12 pb-8 text-base md:text-lg text-foreground/80 leading-relaxed max-w-3xl">
                {a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="relative z-10 bg-background border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">FAQs</p>
          <h2 className="font-serif text-5xl md:text-6xl leading-[1] mb-6">
            Asked <em className="text-accent">often,</em>
            <br />
            answered honestly.
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-xs">
            The questions that show up in every intro call. If yours isn't here, the contact page is
            one scroll away.
          </p>
        </div>
        <div className="md:col-span-8">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
