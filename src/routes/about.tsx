import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Disc } from "lucide-react";
import { parseSpotifyUrl } from "@/lib/utils";
import { useGamification } from "@/hooks/useGamification";

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

const genres = [
  {
    id: "bolly",
    name: "Bollywood Hits 🇮🇳",
    desc: "Melodic tracks and emotional rhythms for grounding designs in storytelling.",
    playlistId: "6uyur68xkcTR7PhPzddh5L",
    color: "from-orange-500/20 to-amber-500/20",
  },
  {
    id: "house",
    name: "House Grooves 🏠",
    desc: "Steady four-on-the-floor beats and deep house tracks to lock into a focused design flow.",
    playlistId: "37i9dQZF1EQpoj8u9Hn81e",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    id: "trance",
    name: "Trance Frequencies 🌀",
    desc: "Uplifting atmospheric trance to drive high-momentum wireframing and prototyping.",
    playlistId: "37i9dQZF1EQqJixB7iHtgb",
    color: "from-purple-500/20 to-pink-500/20",
  },
];

function About() {
  const { trackAboutRead } = useGamification();
  const [activeGenre, setActiveGenre] = useState(genres[0]);

  useEffect(() => {
    trackAboutRead();
  }, [trackAboutRead]);

  useEffect(() => {
    const handleTrackChange = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("portfolio-spotify-track");
        if (saved) {
          try {
            const trimmed = saved.trim();
            let id = "";
            if (trimmed.startsWith("{")) {
              const track = JSON.parse(trimmed);
              if (track && track.id) {
                id = track.id;
              }
            } else {
              const parsed = parseSpotifyUrl(trimmed);
              if (parsed) {
                id = parsed.id;
              } else if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
                id = trimmed;
              }
            }

            if (id) {
              const found = genres.find((g) => g.playlistId === id);
              if (found) {
                setActiveGenre(found);
              }
            }
          } catch (e) {
            console.warn("Failed to parse saved Spotify track on About page:", e);
          }
        }
      }
    };

    handleTrackChange();
    window.addEventListener("portfolio-spotify-track-changed", handleTrackChange);
    return () => {
      window.removeEventListener("portfolio-spotify-track-changed", handleTrackChange);
    };
  }, []);

  const selectGenre = (genre: (typeof genres)[0]) => {
    setActiveGenre(genre);
    if (typeof window !== "undefined") {
      const updated = { type: "playlist", id: genre.playlistId };
      localStorage.setItem("portfolio-spotify-track", JSON.stringify(updated));
      window.dispatchEvent(new Event("portfolio-spotify-track-changed"));
    }
  };

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

        {/* MUSIC PROFILE SECTION */}
        <div className="mt-20 pt-16 border-t border-border">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
            <Music className="h-3.5 w-3.5 text-accent" />
            <span>Soundtrack of my Craft</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            What I listen to <em className="text-accent">while pushing pixels.</em>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Music fuels my design flow. Different problem-solving states require different
            frequencies. Choose a genre card below to load the playlist and hear what is currently
            driving my design cursor:
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Genre Selectors */}
            <div className="md:col-span-7 flex flex-col gap-3">
              {genres.map((g) => {
                const isActive = g.id === activeGenre.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => selectGenre(g)}
                    className={`group w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex gap-4 ${
                      isActive
                        ? "bg-card border-ink shadow-md"
                        : "bg-transparent border-border hover:border-muted-foreground/60 hover:bg-secondary/20"
                    }`}
                  >
                    {/* Active Background Glow */}
                    {isActive && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${g.color} opacity-40 z-0`}
                      />
                    )}

                    <div className="relative z-10 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-sm font-semibold ${isActive ? "text-accent" : "text-foreground"}`}
                        >
                          {g.name}
                        </span>
                        {isActive && (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="inline-block text-accent"
                          >
                            <Disc className="h-3.5 w-3.5" />
                          </motion.span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{g.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Inline Player Card Placeholder for Docking */}
            <div className="md:col-span-5 w-full h-[580px]">
              <div
                id="spotify-profile-placeholder"
                data-compact="false"
                className="w-full h-full rounded-3xl border border-dashed border-border/60 bg-secondary/20"
              />
            </div>
          </div>
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
      </section>
      <SiteFooter />
    </div>
  );
}
