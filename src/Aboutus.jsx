import { useEffect, useRef, useState } from "react";

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

export default function AboutUs() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-[#0B0C0E] text-[#F2EEE7] min-h-screen">
      {/* ============================ NAV ============================ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 transition-colors duration-500 ${
          scrolled
            ? "bg-[#0B0C0E]/70 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <span className="font-mono text-[13px] tracking-[0.25em] uppercase text-[#F2EEE7]/80">
          AradSazan
        </span>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.path}
              className={`text-[13px] tracking-wide transition-colors ${
                link === "About us"
                  ? "text-[#C98A54]"
                  : "text-[#F2EEE7]/70 hover:text-[#F2EEE7]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="text-[11px] font-mono tracking-[0.2em] uppercase border border-[#C98A54]/60 text-[#C98A54] px-4 py-2 rounded-full hover:bg-[#C98A54] hover:text-[#0B0C0E] transition-colors"
        >
          Get a consulation
        </a>
      </nav>

      {/* ============================ HERO ============================ */}
      <section className="relative pt-40 pb-24 px-6 md:px-14 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#F2EEE7 1px, transparent 1px), linear-gradient(90deg, #F2EEE7 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#C98A54] mb-4 uppercase">
            Company dossier / est. 2014
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-6">
            We're not decorators.
            <br />
            We're your rep on site.
          </h1>
          <p className="text-[#F2EEE7]/70 leading-relaxed max-w-xl">
            AradSazan started as three people who were tired of watching good
            renders die on a bad site. We build the same drawing we sell you —
            and we stand on the lot until it matches.
          </p>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="px-6 md:px-14 pb-24">
        <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* ============================ PHILOSOPHY ============================ */}
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

      {/* ============================ PROCESS ============================ */}
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

      {/* ============================ TEAM ============================ */}
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
              className="border border-white/10 rounded-sm p-6 bg-white2 hover:border-[#C98A54]/40 transition-colors"
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

      {/* ============================ CONTACT CTA ============================ */}
      <section
        id="contact"
        className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center border-t border-white/10"
      >
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#C98A54] mb-4 uppercase">
          Ready when you are
        </p>
        <h2 className="font-serif text-3xl md:text-4xl max-w-lg mb-6">
          Let's put your name on the coordinate tag.
        </h2>
        <button className="text-[11px] font-mono tracking-[0.2em] uppercase bg-[#F2EEE7] text-[#0B0C0E] px-6 py-3 rounded-full hover:bg-[#C98A54] transition-colors">
          Contact us
        </button>
      </section>
    </div>
  );
}
