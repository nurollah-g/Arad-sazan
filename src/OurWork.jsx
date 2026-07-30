import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About us", path: "/AboutUs" },
  { label: "Our work", path: "/OurWork" },
  { label: "Contact", path: "#contact" },
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
    hue: "#C98A54",
  },
  {
    id: "02",
    name: "Meydan Office Fit-out",
    category: "Commercial",
    year: "2023",
    coord: "LOT 11 / CBD",
    blurb:
      "Full mechanical rough-in and glazing package delivered to render-grade finish.",
    hue: "#8B9A8C",
  },
  {
    id: "03",
    name: "Baharestan Townhouse",
    category: "Residential",
    year: "2023",
    coord: "LOT 07 / BAHARESTAN",
    blurb:
      "Concept-to-elevation design work paired with in-house procurement and build.",
    hue: "#C98A54",
  },
  {
    id: "04",
    name: "Safaiyeh Retail Shell",
    category: "Commercial",
    year: "2022",
    coord: "LOT 02 / SAFAIYEH",
    blurb:
      "Cladding and storefront glazing executed to the same standard as the original render.",
    hue: "#8B9A8C",
  },
  {
    id: "05",
    name: "Ferdows Villa Renovation",
    category: "Renovation",
    year: "2022",
    coord: "LOT 09 / FERDOWS",
    blurb:
      "Structural rework behind a full interior and envelope refresh, on an occupied site.",
    hue: "#A8763F",
  },
  {
    id: "06",
    name: "Azadi Rooftop Addition",
    category: "Renovation",
    year: "2021",
    coord: "LOT 15 / AZADI",
    blurb:
      "A full rooftop level added without touching the building's working ground floor.",
    hue: "#A8763F",
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

function ProjectPlaceholder({ hue, id }) {
  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden rounded-sm border border-white/10"
      style={{
        background: `linear-gradient(160deg, ${hue}22 0%, #0B0C0E 70%)`,
      }}
    >
      {/* blueprint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(#F2EEE7 1px, transparent 1px), linear-gradient(90deg, #F2EEE7 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* simple structural sketch, color varies per project */}
      <svg
        viewBox="0 0 200 150"
        className="absolute inset-0 w-full h-full"
        fill="none"
        stroke={hue}
        strokeWidth="1.2"
        strokeOpacity="0.8"
      >
        <path d="M30 120 L30 70 L100 35 L170 70 L170 120 Z" />
        <line x1="30" y1="120" x2="170" y2="120" />
        <line
          x1="100"
          y1="35"
          x2="100"
          y2="120"
          strokeDasharray="2 3"
          strokeOpacity="0.4"
        />
      </svg>
      <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.15em] text-[#F2EEE7]/50 uppercase">
        FIG. {id}
      </span>
    </div>
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
    <div className="bg-[#0B0C0E] text-[#F2EEE7] min-h-screen">
      {/* ============================ NAV ============================ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500 ${
          scrolled
            ? "bg-black/20 backdrop-blur-sm border-b border-white/10"
            : "bg-transparent border-b border-transparent"
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
                link.label === "Our work"
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
      <section className="relative pt-40 pb-16 px-6 md:px-14 overflow-hidden">
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
            Field log / all lots
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-6">
            Everything we've
            <br />
            put our name on.
          </h1>
          <p className="text-[#F2EEE7]/70 leading-relaxed max-w-xl">
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
              className={`text-[11px] font-mono tracking-[0.15em] uppercase px-4 py-2 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-[#C98A54] border-[#C98A54] text-[#0B0C0E]"
                  : "border-white/15 text-[#F2EEE7]/60 hover:border-[#F2EEE7]/40 hover:text-[#F2EEE7]"
              }`}
            >
              {cat}
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
              className="group border border-white/10 rounded-sm p-4 bg-white/2 hover:border-[#C98A54]/40 transition-colors"
            >
              <ProjectPlaceholder hue={project.hue} id={project.id} />
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-[#F2EEE7]/40 uppercase">
                    {project.coord}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.15em] text-[#C98A54] uppercase">
                    {project.year}
                  </span>
                </div>
                <h3 className="font-serif text-xl mb-1">{project.name}</h3>
                <p className="text-[11px] font-mono tracking-[0.1em] text-[#F2EEE7]/50 uppercase mb-3">
                  {project.category}
                </p>
                <p className="text-sm text-[#F2EEE7]/60 leading-relaxed">
                  {project.blurb}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-[#F2EEE7]/50 text-sm">
            Nothing logged under this category yet.
          </p>
        )}
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
          Your lot could be the next one logged here.
        </h2>
        <button className="text-[11px] font-mono tracking-[0.2em] uppercase bg-[#F2EEE7] text-[#0B0C0E] px-6 py-3 rounded-full hover:bg-[#C98A54] transition-colors">
          Contact us
        </button>
      </section>
    </div>
  );
}
