import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import excavationImg from "../assets/stage-excavation.jpg";
import foundationImg from "../assets/stage-foundation.jpg";
import framingImg from "../assets/stage-framing.jpg";
import envelopeImg from "../assets/stage-envelope.jpg";
import finishedImg from "../assets/stage-finished.jpg";
import logo from "../assets/logo.png";

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

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About us", path: "/AboutUs" },
  { label: "Our work", path: "/OurWork" },
  { label: "Contact", path: "/Contact" },
];

const STATS = [
  { value: "11", unit: "YRS", label: "In practice", coord: "SINCE 2014" },
  {
    value: "60+",
    unit: "",
    label: "Projects delivered",
    coord: "LEDGER / ALL",
  },
  {
    value: "4",
    unit: "",
    label: "Cities on the books",
    coord: "COAST TO COAST",
  },
];

const PROCESS = [
  {
    n: "01",
    title: "Survey & scope",
    body: "We walk the site before we sketch a single wall. Budget, code, and site constraints get named on day one, not discovered on day ninety.",
  },
  {
    n: "02",
    title: "Design & document",
    body: "Concept, elevations, and construction documents — done in-house, so nothing gets lost in translation between the render and the framer.",
  },
  {
    n: "03",
    title: "Procure & build",
    body: "We source, we schedule, we hold the trades to the drawing. You get one point of contact, not a rolodex of subs to manage yourself.",
  },
  {
    n: "04",
    title: "Deliver & warranty",
    body: "Walkthrough, punch list, close-out — then we stay reachable. A project isn't finished until you've lived in it for a season.",
  },
];

const TEAM = [
  {
    initials: "R.G",
    name: "Reza Ghasemi",
    role: "Founding Principal",
    coord: "LOT 00 / LEAD",
    bio: "Runs point from first sketch to final walkthrough. Believes a good foundation is 90% of a good building.",
  },
  {
    initials: "S.M",
    name: "Sara Moradi",
    role: "Design Director",
    coord: "LOT 00 / DESIGN",
    bio: "Turns client napkin-sketches into elevations the trades can actually build from.",
  },
  {
    initials: "A.K",
    name: "Amir Karimi",
    role: "Site Operations",
    coord: "LOT 00 / FIELD",
    bio: "Keeps the schedule honest and the trades on the same page as the drawing.",
  },
];

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

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ as: Tag = "div", className = "", children }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`${className} transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </Tag>
  );
}

function CountUp({ value, duration = 1400 }) {
  const [ref, visible] = useReveal();
  const [display, setDisplay] = useState("0");

  // Split "60+" into numeric part (60) and trailing suffix ("+")
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic for a nice deceleration into the final number
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target).toString());
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [visible, target, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function BlueprintElevation() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-auto"
      fill="none"
      stroke="#C98A54"
      strokeWidth="1"
    >
      <rect
        x="0.5"
        y="0.5"
        width="399"
        height="299"
        stroke="#F2EEE7"
        strokeOpacity="0.12"
      />
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={(i + 1) * 40}
          y1="0"
          x2={(i + 1) * 40}
          y2="300"
          stroke="#F2EEE7"
          strokeOpacity="0.05"
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={(i + 1) * 40}
          x2="400"
          y2={(i + 1) * 40}
          stroke="#F2EEE7"
          strokeOpacity="0.05"
        />
      ))}
      {/* simple elevation sketch */}
      <path d="M60 240 L60 140 L200 70 L340 140 L340 240 Z" strokeWidth="1.4" />
      <line x1="60" y1="240" x2="340" y2="240" strokeWidth="1.4" />
      <rect x="90" y="170" width="35" height="70" strokeOpacity="0.8" />
      <rect x="150" y="150" width="35" height="90" strokeOpacity="0.8" />
      <rect x="220" y="150" width="35" height="90" strokeOpacity="0.8" />
      <rect x="280" y="170" width="35" height="70" strokeOpacity="0.8" />
      <line
        x1="200"
        y1="70"
        x2="200"
        y2="240"
        strokeOpacity="0.3"
        strokeDasharray="3 4"
      />
      <text
        x="70"
        y="260"
        fill="#F2EEE7"
        fillOpacity="0.5"
        fontSize="8"
        fontFamily="monospace"
        letterSpacing="1"
      >
        ELEV. A — NORTH FACE
      </text>
      <text
        x="290"
        y="30"
        fill="#C98A54"
        fontSize="8"
        fontFamily="monospace"
        letterSpacing="1"
      >
        SCALE 1:100
      </text>
    </svg>
  );
}

// Full-screen mobile nav. Mounted only while open/closing so the
// enter/exit transition can run, then unmounts to keep the DOM clean.
function MobileMenu({ open, onClose }) {
  // Kept mounted at all times; visibility and motion are driven purely by
  // CSS transitions keyed on `open`. No local state needed for the
  // animation, so there's nothing to sync in an effect or a ref.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-60 bg-[#0B0C0E] md:hidden transition-[clip-path,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:duration-300 ${
        open
          ? "opacity-100 [clip-path:inset(0_0_0_0)] pointer-events-auto"
          : "opacity-0 [clip-path:inset(0_0_100%_0)] pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Site menu"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#F2EEE7 1px, transparent 1px), linear-gradient(90deg, #F2EEE7 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative h-full flex flex-col px-6 pt-6 pb-10">
        <div className="flex items-center justify-between mb-14">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#F2EEE7]/40">
            Menu / all pages
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="relative w-9 h-9 flex items-center justify-center text-[#F2EEE7]"
          >
            <span className="absolute w-5 h-[1.5px] bg-current rotate-45" />
            <span className="absolute w-5 h-[1.5px] bg-current -rotate-45" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.path}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className={`group flex items-baseline gap-4 py-4 border-b border-white/10 transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
            >
              <span className="font-mono text-[11px] text-[#C98A54]">
                0{i + 1}
              </span>
              <span className="font-serif text-3xl group-active:text-[#C98A54] transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
          className={`text-[11px] font-mono tracking-[0.2em] uppercase border border-[#C98A54]/60 text-[#C98A54] px-5 py-4 rounded-full text-center transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: open ? "400ms" : "0ms" }}
        >
          Get a consultation
        </a>
      </div>
    </div>
  );
}

export default function ConstructionHero() {
  const scrollRef = useRef(null);
  const progress = useScrollProgress(scrollRef);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500 ${
          scrolledPastHero
            ? "bg-black/20 backdrop-blur-sm border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="LOGO"
            className="h-12 md:h-18 w-auto object-contain "
          />
        </div>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.path}
              className="text-[13px] tracking-wide text-[#F2EEE7]/70 hover:text-[#F2EEE7] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="/contact"
          className="hidden md:inline-block text-[11px] font-mono tracking-[0.2em] uppercase border border-[#C98A54]/60 text-[#C98A54] px-4 py-2 rounded-full hover:bg-[#C98A54] hover:text-[#0B0C0E] transition-colors"
        >
          Get a consulation
        </a>

        {/* Mobile hamburger — asymmetric bars (cream + amber) instead of a generic three-line icon */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          className="md:hidden flex flex-col items-end gap-1.5 w-8 h-8 justify-center"
        >
          <span className="block h-[1.5px] w-6 bg-[#F2EEE7]" />
          <span className="block h-[1.5px] w-4 bg-[#C98A54]" />
        </button>
      </nav>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

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
            {activeIndex === 0 && <div className="flex gap-3"></div>}
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

      {/* ============================ ABOUT: STATS ============================ */}

      <section
        id="about"
        className="px-6 md:px-14 pb-24 pt-28 border-t border-white/10"
      >
        <Reveal className="max-w-2xl mb-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#C98A54] mb-4 uppercase">
            The record so far
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Numbers we can actually stand behind.
          </h2>
        </Reveal>
        <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="border border-white/10 rounded-sm px-6 py-8 bg-white/2"
            >
              <p className="font-mono text-[9px] tracking-[0.2em] text-[#F2EEE7]/40 uppercase mb-3">
                {s.coord}
              </p>
              <p className="font-serif text-4xl mb-2">
                <CountUp value={s.value} />
                <span className="text-[#C98A54] text-xl ml-1">{s.unit}</span>
              </p>
              <p className="text-sm text-[#F2EEE7]/60">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ============================ ABOUT: PHILOSOPHY ============================ */}
      <section className="px-6 md:px-14 pb-28 border-t border-white/10 pt-20">
        <div className="grid md:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#C98A54] mb-4 uppercase">
              Philosophy
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
              Calling us a design firm is a disservice to both of us.
            </h2>
            <p className="text-[#F2EEE7]/70 leading-relaxed mb-4">
              A designer hands you a picture. A contractor hands you a price.
              We're the party that sits on your side of the table for both
              conversations — reading the drawing the way the crew will read it,
              and reading the invoice the way you will.
            </p>
            <p className="text-[#F2EEE7]/70 leading-relaxed">
              Nice things cost. They don't need to cost four times. That's the
              whole pitch.
            </p>
          </Reveal>
          <Reveal className="border border-white/10 rounded-sm p-4 bg-white/2">
            <BlueprintElevation />
          </Reveal>
        </div>
      </section>

      {/* ============================ ABOUT: PROCESS ============================ */}
      <section className="px-6 md:px-14 pb-28 border-t border-white/10 pt-20">
        <Reveal className="max-w-2xl mb-14">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#C98A54] mb-4 uppercase">
            How the partnership runs
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            Four stages. One point of contact.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
          {PROCESS.map((step) => (
            <Reveal key={step.n} className="border-t border-white/10 pt-6">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-mono text-[#C98A54] text-sm tracking-[0.2em]">
                  {step.n}
                </span>
                <h3 className="font-serif text-xl">{step.title}</h3>
              </div>
              <p className="text-[#F2EEE7]/60 text-sm leading-relaxed">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================ ABOUT: TEAM ============================ */}
      <section className="px-6 md:px-14 pb-28 border-t border-white/10 pt-20">
        <Reveal className="max-w-2xl mb-14">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#C98A54] mb-4 uppercase">
            Personnel on record
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight">
            The people who answer the phone.
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((person) => (
            <Reveal
              key={person.name}
              className="border border-white/10 rounded-sm p-6 bg-white/2 hover:border-[#C98A54]/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="h-11 w-11 rounded-full border border-[#C98A54]/50 flex items-center justify-center font-mono text-xs text-[#C98A54]">
                  {person.initials}
                </div>
                <span className="font-mono text-[9px] tracking-[0.15em] text-[#F2EEE7]/40 uppercase">
                  {person.coord}
                </span>
              </div>
              <h3 className="font-serif text-xl mb-1">{person.name}</h3>
              <p className="text-[11px] font-mono tracking-[0.15em] text-[#C98A54] uppercase mb-4">
                {person.role}
              </p>
              <p className="text-sm text-[#F2EEE7]/60 leading-relaxed">
                {person.bio}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ==================== CONTACT ==================== */}
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
        <Link
          to="/Contact"
          className="text-[11px] font-mono tracking-[0.2em] uppercase bg-[#F2EEE7] text-[#0B0C0E] px-6 py-3 rounded-full hover:bg-[#C98A54] transition-colors"
        >
          Contact us
        </Link>
      </section>
    </div>
  );
}
