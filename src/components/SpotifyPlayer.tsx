import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Disc,
  Link2,
  Music,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
  Pause,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { parseSpotifyUrl } from "@/lib/utils";
import { useGamification } from "@/hooks/useGamification";

interface SpotifyPreset {
  name: string;
  desc: string;
  type: string;
  id: string;
  icon: React.ReactNode;
}

interface SpotifyEmbedController {
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  loadUri: (uri: string) => void;
  addListener: (event: string, callback: (e: { data: { isPaused: boolean } }) => void) => void;
}

interface SpotifyIFrameAPI {
  createController: (
    element: HTMLElement,
    options: Record<string, unknown>,
    callback: (controller: SpotifyEmbedController) => void,
  ) => void;
}

const PRESETS: SpotifyPreset[] = [
  {
    name: "Bollywood",
    desc: "Hindi Melodies",
    type: "playlist",
    id: "6uyur68xkcTR7PhPzddh5L",
    icon: <Music className="h-3.5 w-3.5" />,
  },
  {
    name: "House",
    desc: "Deep house flows",
    type: "playlist",
    id: "37i9dQZF1EQpoj8u9Hn81e",
    icon: <Disc className="h-3.5 w-3.5" />,
  },
  {
    name: "Trance",
    desc: "Energetic pulses",
    type: "playlist",
    id: "37i9dQZF1EQqJixB7iHtgb",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
];

export function SpotifyPlayer() {
  const { trackSpotifyPlay, trackSpotifyGenre } = useGamification();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<{ type: string; id: string }>({
    type: "playlist",
    id: "6uyur68xkcTR7PhPzddh5L",
  });
  const [customInput, setCustomInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlayingVisualizer, setIsPlayingVisualizer] = useState(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCompact, setIsCompact] = useState(false);
  const [embedController, setEmbedController] = useState<SpotifyEmbedController | null>(null);
  const currentTrackRef = useRef(currentTrack);
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    if (embedController && currentTrack.id) {
      const uri = `spotify:${currentTrack.type}:${currentTrack.id}`;
      if (typeof embedController.loadUri === "function") {
        embedController.loadUri(uri);
      } else {
        console.warn("Spotify embedController.loadUri is not a function", embedController);
      }
    }
  }, [currentTrack, embedController]);

  useEffect(() => {
    const matchedPreset = PRESETS.find((p) => p.id === currentTrack.id);
    if (matchedPreset) {
      trackSpotifyGenre(matchedPreset.name);
    }
  }, [currentTrack.id, trackSpotifyGenre]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!document.getElementById("spotify-iframe-api-script")) {
        const script = document.createElement("script");
        script.id = "spotify-iframe-api-script";
        script.src = "https://open.spotify.com/embed/iframe-api/v1";
        script.async = true;
        document.body.appendChild(script);
      }

      const win = window as unknown as {
        onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
        spotifyIFrameAPI?: SpotifyIFrameAPI;
      };

      win.onSpotifyIframeApiReady = (IFrameAPI: SpotifyIFrameAPI) => {
        win.spotifyIFrameAPI = IFrameAPI;
        window.dispatchEvent(new Event("spotify-iframe-api-ready"));
      };
    }
  }, []);

  const initSpotifyController = useCallback((iframeElement: HTMLDivElement | null) => {
    if (!iframeElement) return;

    const win = window as unknown as {
      spotifyIFrameAPI?: SpotifyIFrameAPI;
      spotifyEmbedController?: SpotifyEmbedController;
    };
    if (win.spotifyEmbedController) return;

    const setupController = () => {
      const win = window as unknown as {
        spotifyIFrameAPI?: SpotifyIFrameAPI;
        spotifyEmbedController?: SpotifyEmbedController;
      };
      const IFrameAPI = win.spotifyIFrameAPI;
      if (!IFrameAPI) return;

      const track = currentTrackRef.current;
      const initialUri = `spotify:${track.type}:${track.id}`;

      const options = {
        uri: initialUri,
        width: "100%",
        height: "352",
      };

      IFrameAPI.createController(iframeElement, options, (controller: SpotifyEmbedController) => {
        win.spotifyEmbedController = controller;
        setEmbedController(controller);

        controller.addListener("playback_update", (e: { data: { isPaused: boolean } }) => {
          const isPaused = e.data.isPaused;
          setIsPlaying(!isPaused);
          setIsPlayingVisualizer(!isPaused);
          if (!isPaused) {
            trackSpotifyPlay();
          }
          window.dispatchEvent(
            new CustomEvent("portfolio-spotify-play-state", {
              detail: { isPlaying: !isPaused },
            }),
          );
        });
      });
    };

    if (win.spotifyIFrameAPI) {
      setupController();
    } else {
      window.addEventListener("spotify-iframe-api-ready", setupController, { once: true });
    }
  }, []);

  const [layout, setLayout] = useState<{
    isDocked: boolean;
    style: React.CSSProperties;
  }>({
    isDocked: false,
    style: {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      width: "auto",
      zIndex: 50,
    },
  });

  useEffect(() => {
    const loadSavedTrack = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("portfolio-spotify-track");
        if (saved) {
          try {
            const trimmed = saved.trim();
            if (trimmed.startsWith("{")) {
              const track = JSON.parse(trimmed);
              if (track && typeof track === "object" && track.type && track.id) {
                setCurrentTrack(track);
                return;
              }
            }

            const parsed = parseSpotifyUrl(trimmed);
            if (parsed) {
              setCurrentTrack(parsed);
              return;
            }

            if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
              setCurrentTrack({ type: "playlist", id: trimmed });
              return;
            }
          } catch (e) {
            console.warn("Failed to parse saved Spotify track:", e);
          }
        }
      }
    };

    loadSavedTrack();

    if (typeof window !== "undefined") {
      const savedBannerVisible = localStorage.getItem("portfolio-spotify-banner-visible");
      if (savedBannerVisible === "false") {
        setIsBannerVisible(false);
      }
    }

    window.addEventListener("portfolio-spotify-track-changed", loadSavedTrack);
    return () => {
      window.removeEventListener("portfolio-spotify-track-changed", loadSavedTrack);
    };
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const el = document.getElementById("spotify-profile-placeholder");
      if (el) {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          const compactAttr = el.getAttribute("data-compact") === "true";
          setIsCompact(compactAttr);
          setLayout({
            isDocked: true,
            style: {
              position: "absolute",
              top: `${rect.top + window.scrollY}px`,
              left: `${rect.left + window.scrollX}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              bottom: undefined,
              right: undefined,
              zIndex: 30,
            },
          });
          return;
        }
      }

      setIsCompact(false);
      setLayout({
        isDocked: false,
        style: {
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "auto",
          height: undefined,
          top: undefined,
          left: undefined,
          zIndex: 50,
        },
      });
    };

    updateLayout();
    window.addEventListener("scroll", updateLayout);
    window.addEventListener("resize", updateLayout);

    const interval = setInterval(updateLayout, 150);

    return () => {
      window.removeEventListener("scroll", updateLayout);
      window.removeEventListener("resize", updateLayout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handlePlayState = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPlaying(customEvent.detail.isPlaying);
    };

    window.addEventListener("portfolio-spotify-play-state", handlePlayState);
    return () => {
      window.removeEventListener("portfolio-spotify-play-state", handlePlayState);
    };
  }, []);

  const handleTrackChange = (type: string, id: string) => {
    const updated = { type, id };
    setCurrentTrack(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-spotify-track", JSON.stringify(updated));
      window.dispatchEvent(new Event("portfolio-spotify-track-changed"));
    }
    setErrorMessage("");
  };

  const handleCustomLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const parsed = parseSpotifyUrl(customInput);
    if (parsed) {
      handleTrackChange(parsed.type, parsed.id);
      setCustomInput("");
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid Spotify link. Please paste a track, album, or playlist URL.");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const closeFloatingPlayer = () => {
    setIsBannerVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-spotify-banner-visible", "false");
    }
  };

  const restoreFloatingPlayer = () => {
    setIsBannerVisible(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-spotify-banner-visible", "true");
    }
  };

  const handlePlayPause = () => {
    const win = window as unknown as {
      spotifyEmbedController?: SpotifyEmbedController;
    };
    if (win.spotifyEmbedController) {
      win.spotifyEmbedController.togglePlay();
      trackSpotifyPlay();
    }
  };

  const handleNext = () => {
    const currentIndex = PRESETS.findIndex((p) => p.id === currentTrack.id);
    let nextIndex = 0;
    if (currentIndex !== -1) {
      nextIndex = (currentIndex + 1) % PRESETS.length;
    }
    const nextPreset = PRESETS[nextIndex];
    handleTrackChange(nextPreset.type, nextPreset.id);
  };

  const handleBack = () => {
    const currentIndex = PRESETS.findIndex((p) => p.id === currentTrack.id);
    let prevIndex = PRESETS.length - 1;
    if (currentIndex !== -1) {
      prevIndex = (currentIndex - 1 + PRESETS.length) % PRESETS.length;
    }
    const prevPreset = PRESETS[prevIndex];
    handleTrackChange(prevPreset.type, prevPreset.id);
  };

  const activePreset = PRESETS.find(
    (p) => p.type === currentTrack.type && p.id === currentTrack.id,
  );

  const embedUrl = `https://open.spotify.com/embed/${currentTrack.type}/${currentTrack.id}?utm_source=generator&theme=0`;
  const showRestoreButton = !isBannerVisible && !layout.isDocked;

  return (
    <motion.div
      layout
      style={layout.style}
      className={`font-sans overflow-y-auto md:overflow-hidden border border-border bg-card shadow-2xl transition-all duration-300 ${
        layout.isDocked
          ? isCompact
            ? "rounded-3xl p-4 flex flex-col gap-3"
            : "rounded-3xl p-5 flex flex-col gap-4"
          : showRestoreButton
            ? "rounded-full p-0 h-12 w-12 flex items-center justify-center bg-paper hover:bg-secondary cursor-pointer"
            : isExpanded
              ? "rounded-2xl p-4 flex flex-col gap-3 w-[320px] bg-paper/95 backdrop-blur-xl pointer-events-auto"
              : "rounded-full px-4 py-2 flex items-center gap-3.5 h-12 w-auto bg-paper/90 backdrop-blur-md pointer-events-auto"
      }`}
    >
      {/* 1. RESTORE BUTTON CONTENT */}
      {showRestoreButton && (
        <button
          onClick={restoreFloatingPlayer}
          className="h-full w-full flex items-center justify-center text-ink hover:scale-105 transition-all cursor-pointer"
          aria-label="Restore soundtrack"
        >
          <Music className="h-5 w-5 text-accent animate-pulse" />
        </button>
      )}

      {/* 2. MAIN PLAYER CONTENT */}
      {!showRestoreButton && (
        <>
          {/* Header Row (for Docked cards and Expanded drawer) */}
          {(layout.isDocked || isExpanded) && (
            <div className="flex items-center justify-between border-b border-border pb-2 shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 text-accent">
                  <Music className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink leading-none">
                    {layout.isDocked && !isCompact ? "The music I listen to" : "Vibe Player"}
                  </h3>
                  <p className="text-[9.5px] uppercase tracking-wider text-muted-foreground mt-1 font-mono">
                    Active: {activePreset ? activePreset.name : "Custom Stream"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Media Playback Controls inside Header for convenience */}
                <div className="flex items-center gap-1.5 mr-1 bg-secondary/60 px-2 py-1 rounded-full border border-border/40">
                  <button
                    onClick={handleBack}
                    className="hover:text-accent p-0.5 rounded transition-colors text-muted-foreground hover:text-ink cursor-pointer"
                    title="Previous"
                  >
                    <SkipBack className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="hover:text-accent p-0.5 transition-colors text-ink cursor-pointer flex items-center justify-center"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="h-2.5 w-2.5 text-accent" />
                    ) : (
                      <Play className="h-2.5 w-2.5 text-foreground" />
                    )}
                  </button>
                  <button
                    onClick={handleNext}
                    className="hover:text-accent p-0.5 rounded transition-colors text-muted-foreground hover:text-ink cursor-pointer"
                    title="Next"
                  >
                    <SkipForward className="h-3 w-3" />
                  </button>
                </div>

                {/* Visualizer bars */}
                <div className="flex items-end gap-0.5 h-3">
                  {[0.6, 1.1, 0.8, 1.0].map((speed, i) => (
                    <motion.span
                      key={i}
                      className="w-0.5 bg-accent rounded-full origin-bottom"
                      style={{ height: "100%" }}
                      animate={isPlayingVisualizer ? { scaleY: [0.2, 1, 0.2] } : { scaleY: 0.2 }}
                      transition={{
                        repeat: Infinity,
                        duration: speed,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                {/* Close/Minimize button for floating expanded drawer */}
                {!layout.isDocked && isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-ink cursor-pointer ml-1"
                    title="Minimize"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Vibe Selectors (presets) */}
          {((layout.isDocked && !isCompact) || (!layout.isDocked && isExpanded)) && (
            <div className="flex flex-col gap-1.5 border-b border-border/40 pb-3 shrink-0">
              {!layout.isDocked && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Select Vibe:
                </span>
              )}
              <div
                className={layout.isDocked ? "flex flex-wrap gap-2" : "grid grid-cols-3 gap-1.5"}
              >
                {PRESETS.map((preset) => {
                  const isSelected =
                    currentTrack.type === preset.type && currentTrack.id === preset.id;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => handleTrackChange(preset.type, preset.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-ink border-ink text-paper shadow-sm font-semibold"
                          : "bg-background hover:bg-secondary border-border text-ink"
                      } ${!layout.isDocked ? "flex-col p-1.5 items-center text-center justify-center" : ""}`}
                    >
                      <span className={isSelected ? "text-accent" : "text-muted-foreground"}>
                        {preset.icon}
                      </span>
                      <span className="text-xs font-semibold leading-none">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Persistent Iframe Wrapper (Always rendered at the exact same location in the DOM) */}
      <div
        className={
          !showRestoreButton && (layout.isDocked || isExpanded)
            ? "relative rounded-2xl overflow-hidden bg-background border border-border shadow-inner w-full shrink-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:block"
            : "fixed -top-[9999px] -left-[9999px] w-[320px] h-[352px] pointer-events-none opacity-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:block"
        }
        style={{
          height: !showRestoreButton && (layout.isDocked || isExpanded) ? "352px" : "152px",
          marginTop: !showRestoreButton && (layout.isDocked || isExpanded) ? "8px" : "0px",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div
          ref={initSpotifyController}
          id="spotify-embed-iframe-placeholder"
          className="w-full h-full block bg-transparent"
        />
      </div>

      {/* 3. MAIN PLAYER CONTROLS (for docked/expanded URL loading and collapsed floating pill) */}
      {!showRestoreButton && (
        <>
          {/* Custom Link Loader Form */}
          {((layout.isDocked && !isCompact) || (!layout.isDocked && isExpanded)) && (
            <div className="flex flex-col gap-2 border-t border-border/40 pt-3 shrink-0">
              <form
                onSubmit={handleCustomLinkSubmit}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                {layout.isDocked && (
                  <div className="flex flex-col gap-0.5">
                    <label
                      htmlFor="spotify-link"
                      className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
                    >
                      Or Play Custom Spotify URL:
                    </label>
                    <span className="text-[9px] text-muted-foreground">
                      Paste track, playlist, or album link
                    </span>
                  </div>
                )}
                <div className="flex gap-2 flex-1 max-w-md w-full">
                  <div className="relative flex-1">
                    <input
                      id="spotify-link"
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="https://open.spotify.com/..."
                      className="w-full pl-7 pr-2 py-1.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-accent text-ink placeholder:text-muted-foreground/60 transition-all font-mono"
                    />
                    <Link2 className="absolute left-2.5 top-2.5 h-3 w-3 text-muted-foreground" />
                  </div>
                  <button
                    type="submit"
                    disabled={!customInput.trim()}
                    className="px-3.5 py-1.5 rounded-xl text-xs bg-ink hover:bg-accent text-paper disabled:bg-muted/50 disabled:text-muted-foreground/50 transition-all cursor-pointer shrink-0"
                  >
                    Load URL
                  </button>
                </div>
              </form>
              {errorMessage && (
                <div className="text-[9px] text-destructive font-medium flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {layout.isDocked && !isCompact && (
                <p className="text-[9px] text-muted-foreground text-center italic mt-1">
                  Log in to Spotify on this browser to play full songs.
                </p>
              )}
            </div>
          )}

          {/* Floating Pill Controls (rendered when floating and collapsed) */}
          {!layout.isDocked && !isExpanded && (
            <div className="flex items-center gap-3.5 h-full w-full pointer-events-auto">
              <div className="flex items-center gap-2 pr-3 border-r border-border/40 shrink-0">
                <Music className="h-4 w-4 text-accent animate-pulse" />
                <span className="font-serif text-sm font-bold text-ink leading-none">
                  {activePreset ? activePreset.name.split(" ")[0] : "Custom"}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleBack}
                  className="hover:text-accent p-0.5 rounded transition-colors text-muted-foreground hover:text-ink cursor-pointer flex items-center justify-center"
                  title="Previous"
                >
                  <SkipBack className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="hover:text-accent p-1.5 bg-secondary rounded-full border border-border/60 shadow-sm transition-colors text-ink cursor-pointer flex items-center justify-center"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-3 w-3 text-accent" />
                  ) : (
                    <Play className="h-3 w-3 text-foreground" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="hover:text-accent p-0.5 rounded transition-colors text-muted-foreground hover:text-ink cursor-pointer flex items-center justify-center"
                  title="Next"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-1">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="hover:text-accent p-0.5 rounded transition-colors border border-border/40 text-muted-foreground hover:text-ink cursor-pointer flex items-center justify-center"
                  title="Expand Player"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={closeFloatingPlayer}
                  className="hover:text-accent p-0.5 rounded transition-colors text-muted-foreground hover:text-ink cursor-pointer flex items-center justify-center"
                  title="Dismiss player"
                  aria-label="Dismiss player"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
