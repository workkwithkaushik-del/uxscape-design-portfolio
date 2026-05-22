import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Tilt3D } from "@/components/Tilt3D";
import { Reveal } from "@/components/ScrollReveal";
import annotated from "@/assets/portrait-annotated.png";
import candid from "@/assets/portrait-candid.jpg";

const loves = [
  {
    k: "01",
    t: "Re-framing briefs",
    d: "The first week is for finding the load-bearing assumption nobody named.",
  },
  {
    k: "02",
    t: "Watching people use things",
    d: "Six messy interviews beat a six-hundred-person survey, every time.",
  },
  {
    k: "03",
    t: "Designing for the floor",
    d: "Operators on a phone, one-handed, mid-rush. That's the real user.",
  },
  {
    k: "04",
    t: "Writing things down",
    d: "If it isn't a doc, it isn't a decision. Postmortems get shared, not buried.",
  },
];

export function ProfileSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yB = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const rotA = useTransform(scrollYProgress, [0, 1], [-6, 4]);
  const rotB = useTransform(scrollYProgress, [0, 1], [5, -3]);

  return (
    <section
      ref={ref}
      id="profile"
      className="relative border-y border-border bg-secondary/30 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Photo collage */}
        <div className="lg:col-span-6 relative h-[420px] sm:h-[560px] md:h-[640px]">
          {/* Annotated lifestyle, front layer */}
          <motion.div
            style={{ y: yA, rotate: rotA }}
            className="absolute top-0 left-0 w-[68%] aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] ring-1 ring-border z-10"
          >
            <Tilt3D max={6} className="h-full w-full rounded-3xl overflow-hidden">
              <img
                src={annotated}
                alt="Kaushik with hand-drawn design principles around him"
                className="h-full w-full object-cover"
              />
            </Tilt3D>
          </motion.div>

          {/* Candid, back layer */}
          <motion.div
            style={{ y: yB, rotate: rotB }}
            className="absolute bottom-6 right-0 w-[58%] aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] ring-1 ring-border"
          >
            <Tilt3D max={8} className="h-full w-full rounded-3xl overflow-hidden">
              <img src={candid} alt="Kaushik, candid" className="h-full w-full object-cover" />
            </Tilt3D>
          </motion.div>

          {/* signature tag, replaces duplicate headshot polaroid */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -8 }}
            whileInView={{ opacity: 1, y: 0, rotate: -4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-2 sm:left-4 md:left-10 w-44 sm:w-56 md:w-64 z-20"
          >
            <Tilt3D max={10} className="rounded-2xl">
              <div className="bg-paper px-4 py-3 sm:px-6 sm:py-5 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] ring-1 ring-border">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-0.5 sm:mb-1">
                  Signed,
                </p>
                <p className="font-serif italic text-2xl sm:text-3xl text-foreground leading-none">
                  Kaushik.
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">
                  Pune, IN · est. 2024
                </p>
              </div>
            </Tilt3D>
          </motion.div>

          {/* floating accent dot */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-4 sm:top-10 right-2 sm:right-6 h-10 w-10 sm:h-16 sm:w-16 rounded-full bg-accent text-accent-foreground grid place-items-center font-serif text-sm sm:text-xl shadow-lg z-30"
          >
            ✦
          </motion.div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-6">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              The person behind the pixels
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-5xl md:text-6xl leading-[1.02] mb-8">
              I design like I argue, <em className="text-accent">curious first,</em> opinionated
              second.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg text-foreground/85 leading-relaxed mb-6">
              I'm a product designer based in Pune. I spend my days turning dense systems into calm,
              decision-first interfaces, dashboards, workflows, AI surfaces, the kind of software
              that has to work on a Tuesday at 4pm when nothing else does.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-lg text-foreground/85 leading-relaxed mb-10">
              Off the canvas: long-form writing, slow coffee, and a quiet obsession with how
              supermarkets lay out their aisles. I'll happily redraw a flow on a napkin. I care a
              lot about typography. I think hand-off is a conversation, not a Zip file.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {loves.map((l, i) => (
              <Reveal key={l.k} delay={0.1 + i * 0.06}>
                <Tilt3D max={6} className="rounded-2xl">
                  <div className="rounded-2xl border border-border bg-card p-5 h-full">
                    <p className="font-serif text-2xl text-accent mb-1">{l.k}</p>
                    <p className="font-medium mb-1">{l.t}</p>
                    <p className="text-sm text-muted-foreground leading-snug">{l.d}</p>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
