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
    hue: "#C98A54",
    photo: "/images/images.webp",
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
    photo: "/images/office.webp",
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
    photo: "/images/townhouse.webp",
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
    photo: "/images/retail.webp",
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
    photo: "/images/renovation.webp",
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
    photo: "/images/addition.webp",
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

function Reveal({ as: Tag = "div", className = "", delay = 0, children }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`${className} transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </Tag>
  );
}

function ProjectPhoto({ src, alt }) {
  return (
    <div className="relative w-full aspect-4/3 overflow-hidden border-b border-[#565C5E]/25">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover grayscale-[30%] contrast-[1.05] group-hover:grayscale-0 transition-[filter] duration-500"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,18,16,0) 60%, rgba(18,18,16,0.55) 100%)",
        }}
      />
    </div>
  );
}

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
      className={`fixed inset-0 z-[60] bg-[#0B0C0E] md:hidden transition-[clip-path,opacity] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:duration-300 ${
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

export default function OurWork() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          className="hidden md:inline-block text-[11px] font-mono tracking-[0.2em] uppercase border border-[#C98A54]/60 text-[#C98A54] px-4 py-2 rounded-full hover:bg-[#C98A54] hover:text-[#0B0C0E] transition-colors"
        >
          Get a consulation
        </a>

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
          {filtered.map((project, index) => (
            <Reveal
              key={project.id}
              delay={(index % 3) * 100}
              className="group border border-white/10 rounded-sm p-4 bg-white/2 hover:border-[#C98A54]/40 transition-colors"
            >
              <ProjectPhoto src={project.photo} alt={project.name} />
              <div className="px-5 py-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-[#F2EEE7]/40 uppercase">
                    {project.coord}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.15em] text-[#C98A54] uppercase">
                    {project.year}
                  </span>
                </div>
                <h3 className="font-serif text-xl mb-1">{project.name}</h3>
                <p className="text-[11px] font-mono tracking-widest text-[#F2EEE7]/50 uppercase mb-3">
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
