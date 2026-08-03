import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About us", path: "/AboutUs" },
  { label: "Our work", path: "/OurWork" },
  { label: "Contact", path: "/Contact" },
];

const CATEGORIES = ["All", "Residential", "Commercial", "Renovation"];

const PROJECTS = [
  {
    id: "01",
    name: "Lot 04 Residence",
    category: "Residential",
    year: "2024",
    coord: "LOT 04 / QOM",
    blurb:
      "A four-stage build from raw excavation to a finished envelope, documented at every phase.",
  },
  {
    id: "02",
    name: "Meydan Office Fit-out",
    category: "Commercial",
    year: "2023",
    coord: "LOT 11 / CBD",
    blurb:
      "Full mechanical rough-in and glazing package delivered to render-grade finish.",
  },
  {
    id: "03",
    name: "Baharestan Townhouse",
    category: "Residential",
    year: "2023",
    coord: "LOT 07 / BAHARESTAN",
    blurb:
      "Concept-to-elevation design work paired with in-house procurement and build.",
  },
  {
    id: "04",
    name: "Safaiyeh Retail Shell",
    category: "Commercial",
    year: "2022",
    coord: "LOT 02 / SAFAIYEH",
    blurb:
      "Cladding and storefront glazing executed to the same standard as the original render.",
  },
  {
    id: "05",
    name: "Ferdows Villa Renovation",
    category: "Renovation",
    year: "2022",
    coord: "LOT 09 / FERDOWS",
    blurb:
      "Structural rework behind a full interior and envelope refresh, on an occupied site.",
  },
  {
    id: "06",
    name: "Azadi Rooftop Addition",
    category: "Renovation",
    year: "2021",
    coord: "LOT 15 / AZADI",
    blurb:
      "A full rooftop level added without touching the building's working ground floor.",
  },
];

// material composition per category — like a geological core sample from the site
const CORE_BANDS = {
  Residential: [
    { color: "#C7C2B8", weight: 3 },
    { color: "#8C6239", weight: 2 },
    { color: "#4A4F52", weight: 2 },
    { color: "#E8542E", weight: 1 },
  ],
  Commercial: [
    { color: "#4A4F52", weight: 3 },
    { color: "#6E7476", weight: 2 },
    { color: "#C7C2B8", weight: 2 },
    { color: "#E8542E", weight: 1 },
  ],
  Renovation: [
    { color: "#8C6239", weight: 2 },
    { color: "#E8542E", weight: 2 },
    { color: "#4A4F52", weight: 3 },
    { color: "#C7C2B8", weight: 1 },
  ],
};

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
      { threshold: 0.15 },
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

function CoreSample({ category }) {
  const bands = CORE_BANDS[category] || CORE_BANDS.Residential;
  return (
    <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col overflow-hidden border-r border-black/40">
      {bands.map((b, i) => (
        <div
          key={i}
          style={{ flexGrow: b.weight, background: b.color }}
          className="relative"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, #000 3px, #000 4px)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function Rivets() {
  const dot = "absolute w-1 h-1 rounded-full bg-[#C7C2B8]/15";
  return (
    <>
      <span className={`${dot} top-1.5 right-1.5`} />
      <span
        className={`$

{dot} bottom-1.5 right-1.5`}
      />
    </>
  );
}

export default function OurWork() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered =
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-[#121210] text-[#C7C2B8] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
      `}</style>

      {/* ============================ NAV ============================ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500 border-b-2 ${
          scrolled
            ? "bg-[#0E0E0C] border-[#E8542E]/60"
            : "bg-transparent border-transparent"
        }`}
      >
        <span className="font-['IBM_Plex_Mono'] text-[13px] tracking-[0.25em] uppercase text-[#C7C2B8]/80">
          AradSazan
        </span>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.path}
              className={`font-['IBM_Plex_Sans'] text-[13px] tracking-wide transition-colors ${
                link.label === "Our work"
                  ? "text-[#E8542E]"
                  : "text-[#C7C2B8]/70 hover:text-[#C7C2B8]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="text-[11px] font-['IBM_Plex_Mono'] tracking-[0.2em] uppercase border border-dashed border-[#E8542E]/70 text-[#E8542E] px-4 py-2 hover:bg-[#E8542E] hover:text-[#121210] hover:border-solid transition-colors"
        >
          Request quote
        </a>
      </nav>

      {/* ============================ HERO ============================ */}
      <section className="relative pt-40 pb-16 px-6 md:px-14 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#C7C2B8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="absolute top-24 right-6 md:right-14 w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-dashed border-[#E8542E]/70 flex items-center justify-center -rotate-[10deg] opacity-80 pointer-events-none">
          <span className="font-['IBM_Plex_Mono'] text-[9px] tracking-[0.15em] text-[#E8542E] text-center uppercase leading-tight px-2">
            Site
            <br />
            Verified
          </span>
        </div>

        <div className="relative max-w-3xl">
          <p className="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.3em] text-[#E8542E] mb-4 uppercase">
            [ Field log / all lots ]
          </p>
          <h1 className="font-['Oswald'] font-semibold uppercase text-4xl md:text-6xl leading-[0.95] tracking-tight mb-6">
            Everything we've
            <br />
            put our name on.
          </h1>
          <p className="font-['IBM_Plex_Sans'] text-[#C7C2B8]/70 leading-relaxed max-w-xl">
            Every lot below went through the same four stages you saw on the way
            in — survey, design, build, deliver. Filter by type to see the ones
            closest to what you're planning.
          </p>
        </div>
      </section>

      {/* ============================ FILTER TABS ============================ */}
      <section className="px-6 md:px-14 pb-10">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-['IBM_Plex_Mono'] text-[11px] tracking-[0.15em] uppercase px-4 py-2 border transition-colors ${
                activeCategory === cat
                  ? "bg-[#E8542E] border-[#E8542E] text-[#121210]"
                  : "border-[#565C5E]/50 text-[#C7C2B8]/60 hover:border-[#C7C2B8]/40 hover:text-[#C7C2B8]"
              }`}
            >
              [ {cat} ]
            </button>
          ))}
        </div>
      </section>

      {/* ============================ PROJECT GRID ============================ */}
      <section className="px-6 md:px-14 pb-28">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Reveal
              key={project.id}
              className="group relative border border-[#565C5E]/25 bg-[#1B1B17] hover:border-[#E8542E]/50 transition-colors pl-8 pr-5 py-5"
            >
              <CoreSample category={project.category} />
              <Rivets />

              <div className="flex items-center justify-between mb-3">
                <span className="font-['IBM_Plex_Mono'] text-[9px] tracking-[0.15em] text-[#C7C2B8]/40 uppercase">
                  PMT-{project.id}/{project.year.slice(-2)}
                </span>
                <span className="font-['IBM_Plex_Mono'] text-[9px] tracking-[0.15em] text-[#E8542E] uppercase">
                  {project.year}
                </span>
              </div>
              <h3 className="font-['Oswald'] uppercase tracking-tight text-xl mb-1">
                {project.name}
              </h3>
              <p className="text-[11px] font-['IBM_Plex_Mono'] tracking-widest text-[#C7C2B8]/45 uppercase mb-3">
                [ {project.category} ]
              </p>
              <p className="text-sm font-['IBM_Plex_Sans'] text-[#C7C2B8]/60 leading-relaxed">
                {project.blurb}
              </p>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-[0.15em] text-[#565C5E] group-hover:text-[#E8542E] transition-colors">
                <span>View lot</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="font-['IBM_Plex_Sans'] text-[#C7C2B8]/50 text-sm">
            No lots logged under this filter yet.
          </p>
        )}
      </section>

      {/* ============================ CONTACT CTA ============================ */}
      <section
        id="contact"
        className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 text-center border-t border-[#565C5E]/25"
      >
        <p className="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.3em] text-[#E8542E] mb-4 uppercase">
          [ Ready when you are ]
        </p>
        <h2 className="font-['Oswald'] uppercase font-semibold tracking-tight text-3xl md:text-4xl max-w-lg mb-6">
          Your lot could be next in the log.
        </h2>
        <button className="text-[11px] font-['IBM_Plex_Mono'] tracking-[0.2em] uppercase bg-[#C7C2B8] text-[#121210] px-6 py-3 border border-dashed border-transparent hover:bg-[#E8542E] hover:border-[#121210] transition-colors">
          Contact us
        </button>
      </section>
    </div>
  );
}
