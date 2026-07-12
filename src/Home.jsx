import { useState, useEffect, useRef } from "react";
import excavationImg from "./assets/stage-excavation.jpg";
import foundationImg from "./assets/stage-foundation.jpg";
import framingImg from "./assets/stage-framing.jpg";
import envelopeImg from "./assets/stage-envelope.jpg";
import finishedImg from "./assets/stage-finished.jpg";
import logo from "./assets/logo.png";

const STAGE_IMAGES = {
  excavation: excavationImg,
  foundation: foundationImg,
  framing: framingImg,
  envelope: envelopeImg,
  finished: finishedImg,
};

const STAGES = [
  {
    key: "excavation",
    label: "EXCAVATION",
    coord: "LOT 04 / SITE PREP",
    heading: "Every build starts\nin the dirt.",
    caption:
      "We survey, grade, and cut the pad before a single beam goes up — so the house that follows never has to fight its own foundation.",
  },
  {
    key: "foundation",
    label: "FOUNDATION",
    coord: "LOT 04 / STAGE 01",
    heading: "We build\nsensational spaces.",
    caption:
      "Calling us interior designers or a design firm is a disservice to both you and us. We're your partner and owner's representative from day one.",
  },
  {
    key: "framing",
    label: "FRAMING",
    coord: "LOT 04 / STAGE 02",
    heading: "From concept & 3D\nto elevations.",
    caption:
      "Full detail matter, including the merch-ups. Nice things cost, but they don't need to cost 4x. We save you thousands without compromising the look you desire.",
  },
  {
    key: "envelope",
    label: "ENVELOPE",
    coord: "LOT 04 / STAGE 03",
    heading: "Award winning\ndesign & build.",
    caption:
      "Full service beyond 'interior design' — glazing, cladding, and mechanical rough-in executed to the same standard as the render.",
  },
  {
    key: "finished",
    label: "COMPLETE",
    coord: "LOT 04 / DELIVERED",
    heading: "Creating\ncool sh!t.",
    caption:
      "We advocate, we find, we design, we build, we procure, we warehouse, we manage, and we execute at the highest level from coast to coast.",
  },
];

const NAV_LINKS = ["About us", "Our work", "Contact"];

function useScrollProgress(containerRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const pct = total > 0 ? scrolled / total : 0;
      setProgress(pct);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef]);

  return progress;
}

export default function ConstructionHero() {
  const scrollRef = useRef(null);
  const progress = useScrollProgress(scrollRef);

  const stageCount = STAGES.length;
  const rawIndex = progress * (stageCount - 1);
  const activeIndex = Math.min(
    stageCount - 1,
    Math.max(0, Math.round(rawIndex)),
  );
  const activeStage = STAGES[activeIndex];

  // Crossfade weight between current and next stage image for a smooth scrub
  const lowerIndex = Math.min(stageCount - 1, Math.floor(rawIndex));
  const upperIndex = Math.min(stageCount - 1, lowerIndex + 1);
  const blend = rawIndex - lowerIndex;

  const scrolledPastHero = progress > 0.01;

  return (
    <div className="bg-[#0B0C0E] text-[#F2EEE7]">
      {/* ============================ NAV ============================ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 transition-colors duration-500 ${
          scrolledPastHero
            ? "bg-[#0B0C0E]/70 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="LOGO"
            className="h-12 md:h-18 w-auto object-contain "
          />
          {/* <span className="font-mono text-[14px] tracking-[0.25em] uppercase text-[#F2EEE7]/80">
            AradSazan
          </span> */}
        </div>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] tracking-wide text-[#F2EEE7]/70 hover:text-[#F2EEE7] transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="text-[11px] font-mono tracking-[0.2em] uppercase border border-[#C98A54]/60 text-[#C98A54] px-4 py-2 rounded-full hover:bg-[#C98A54] hover:text-[#0B0C0E] transition-colors"
        >
          Get a quote
        </a>
      </nav>

      {/* ==================== SCROLL-SCRUBBED HERO ==================== */}
      <section ref={scrollRef} className="relative" style={{ height: "500vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img
            src={STAGE_IMAGES[STAGES[lowerIndex].key]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 1 - blend }}
          />
          <img
            src={STAGE_IMAGES[STAGES[upperIndex].key]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: blend }}
          />

          {/* Fog / atmosphere layer */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-40 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 30% 70%, rgba(139,154,140,0.35), transparent 60%), radial-gradient(ellipse 50% 30% at 70% 60%, rgba(139,154,140,0.25), transparent 65%)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0B0C0E] via-transparent to-[#0B0C0E]/30" />
          </div>

          {/* Blueprint coordinate tag, top-right */}
          <div className="absolute top-24 right-6 md:right-10 font-mono text-[10px] tracking-[0.2em] text-[#F2EEE7]/60 border border-white/15 px-3 py-1.5 rounded-sm bg-black/20 backdrop-blur-sm">
            {activeStage.coord}
          </div>

          {/* Heading + caption, bottom-left */}
          <div className="absolute bottom-28 md:bottom-24 left-6 md:left-14 max-w-md">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#C98A54] mb-3 uppercase">
              {activeStage.label}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] whitespace-pre-line mb-4">
              {activeStage.heading}
            </h1>
            <p className="text-sm text-[#F2EEE7]/70 leading-relaxed mb-6 max-w-sm">
              {activeStage.caption}
            </p>
            {activeIndex === 0 && (
              <div className="flex gap-3">
                <button className="text-[11px] font-mono tracking-[0.2em] uppercase bg-[#F2EEE7] text-[#0B0C0E] px-5 py-3 rounded-full hover:bg-[#C98A54] transition-colors">
                  Learn more
                </button>
                <button className="text-[11px] font-mono tracking-[0.2em] uppercase border border-[#F2EEE7]/40 px-5 py-3 rounded-full hover:border-[#F2EEE7] transition-colors">
                  Contact us
                </button>
              </div>
            )}
          </div>

          {/* Scroll-to-explore prompt, only at the very start */}
          {progress < 0.03 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
              <div className="h-8 w-5 rounded-full border border-[#F2EEE7]/50 flex items-start justify-center p-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#F2EEE7]/70" />
              </div>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F2EEE7]/50">
                Scroll to explore
              </span>
            </div>
          )}

          {/* Stage rail, bottom */}
          <div className="absolute bottom-0 inset-x-0 px-6 md:px-10 pb-5">
            <div className="flex justify-between mb-2">
              {STAGES.map((s, i) => (
                <span
                  key={s.key}
                  className={`font-mono text-[9px] tracking-[0.15em] uppercase transition-colors duration-300 ${
                    i === activeIndex ? "text-[#C98A54]" : "text-[#F2EEE7]/30"
                  }`}
                >
                  {s.label}
                </span>
              ))}
            </div>
            <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C98A54] transition-[width] duration-100 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEXT SECTION PLACEHOLDER ==================== */}
      <section
        id="contact"
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center border-t border-white/10"
      >
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#C98A54] mb-4 uppercase">
          Ready when you are
        </p>
        <h2 className="font-serif text-3xl md:text-4xl max-w-lg mb-6">
          Let's build something worth the fog machine.
        </h2>
        <button className="text-[11px] font-mono tracking-[0.2em] uppercase bg-[#F2EEE7] text-[#0B0C0E] px-6 py-3 rounded-full hover:bg-[#C98A54] transition-colors">
          Start a project
        </button>
      </section>
    </div>
  );
}
