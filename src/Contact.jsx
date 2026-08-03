import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About us", path: "/AboutUs" },
  { label: "Our work", path: "/OurWork" },
  { label: "Contact", path: "/Contact" },
];

const PROJECT_TYPES = [
  { label: "Residential", coord: "TYPE 01" },
  { label: "Commercial", coord: "TYPE 02" },
  { label: "Renovation", coord: "TYPE 03" },
  { label: "Other", coord: "TYPE 04" },
];

const SYSTEM_PROMPT = `You are a technical project consultant for "AradSazan", a construction company.
AradSazan builds, designs, and executes construction projects in four stages: survey, design, build, deliver.
Based on the information the visitor provides about their project, give practical, specific initial consulting advice.
Keep the tone professional, grounded, and concise. You can end with one follow-up question to sharpen the advice.
If the visitor needs an exact price or a formal timeline, suggest they book a full consultation with the AradSazan team.`;

async function callClaude(messages) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });
  const data = await response.json();
  const text = (data.content || [])
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("\n")
    .trim();
  return text || "No response came back. Please try again.";
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

function FieldFrame({ tag, label, error, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] tracking-[0.15em] text-[#F2EEE7]/40 uppercase">
          {tag}
        </span>
        <span className="font-mono text-[9px] tracking-[0.15em] text-[#C98A54] uppercase">
          {label}
        </span>
      </div>
      {children}
      {error && (
        <p className="mt-1.5 font-mono text-[10px] tracking-wide text-[#C9704A]">
          {error}
        </p>
      )}
    </div>
  );
}

const fieldClasses =
  "w-full bg-transparent border border-white/10 rounded-sm px-4 py-3 text-[#F2EEE7] placeholder-[#F2EEE7]/30 focus:outline-none focus:border-[#C98A54]/50 transition-colors";

export default function Contact() {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState("form"); // 'form' | 'chat'
  const [form, setForm] = useState({
    name: "",
    phone: "",
    projectType: PROJECT_TYPES[0].label,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollBoxRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name";
    if (!form.phone.trim()) next.phone = "Enter a phone number";
    if (!form.description.trim())
      next.description = "Add a short project description";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const intakeSummary = `Project details:
- Name: ${form.name}
- Phone: ${form.phone}
- Project type: ${form.projectType}
- Description: ${form.description}

Please give an initial consultation based on this information.`;

    setView("chat");
    setLoading(true);
    setMessages([{ role: "user", content: intakeSummary, display: false }]);

    try {
      const reply = await callClaude([
        { role: "user", content: intakeSummary },
      ]);
      setMessages([
        { role: "user", content: intakeSummary, display: false },
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages([
        { role: "user", content: intakeSummary, display: false },
        {
          role: "assistant",
          content:
            "Something went wrong reaching the consultant. Please try again, or contact the AradSazan team directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleChatSend(e) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setChatInput("");
    setLoading(true);

    try {
      const apiMessages = nextMessages.map(({ role, content }) => ({
        role,
        content,
      }));
      const reply = await callClaude(apiMessages);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

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
                link.label === "Contact"
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
          Get a consultation
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
            Intake / new lot
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-6">
            {view === "form" ? (
              <>
                Tell us what
                <br />
                you're building.
              </>
            ) : (
              <>
                Talking through
                <br />
                the details.
              </>
            )}
          </h1>
          <p className="text-[#F2EEE7]/70 leading-relaxed max-w-xl">
            {view === "form"
              ? "A few details, then you're straight into a conversation with our project consultant — ask whatever you need before it becomes a formal quote."
              : "Here's an initial read on your project. Keep asking, or head back to the form to start over."}
          </p>
        </div>
      </section>

      {/* ============================ FORM ============================ */}
      {view === "form" && (
        <section className="px-6 md:px-14 pb-28">
          <div className="max-w-2xl">
            <Reveal className="border border-white/10 rounded-sm p-6 md:p-8 bg-white/2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <FieldFrame tag="LOT / NEW" label="Full name">
                  <input
                    type="text"
                    className={fieldClasses}
                    placeholder="e.g. Alex Morgan"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </FieldFrame>
                {errors.name && (
                  <p className="-mt-4 font-mono text-[10px] text-[#C9704A]">
                    {errors.name}
                  </p>
                )}

                <FieldFrame tag="LOT / NEW" label="Phone">
                  <input
                    type="tel"
                    className={fieldClasses}
                    placeholder="+1 555 000 0000"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </FieldFrame>
                {errors.phone && (
                  <p className="-mt-4 font-mono text-[10px] text-[#C9704A]">
                    {errors.phone}
                  </p>
                )}

                <div>
                  <span className="block font-mono text-[9px] tracking-[0.15em] text-[#F2EEE7]/40 uppercase mb-2">
                    Project type
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {PROJECT_TYPES.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => updateField("projectType", t.label)}
                        className={`text-[11px] font-mono tracking-[0.15em] uppercase px-4 py-2 rounded-full border transition-colors ${
                          form.projectType === t.label
                            ? "bg-[#C98A54] border-[#C98A54] text-[#0B0C0E]"
                            : "border-white/15 text-[#F2EEE7]/60 hover:border-[#F2EEE7]/40 hover:text-[#F2EEE7]"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <FieldFrame tag="LOT / NEW" label="Description">
                  <textarea
                    rows={4}
                    className={fieldClasses + " resize-none"}
                    placeholder="Square footage, location, rough budget, and anything else that matters..."
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </FieldFrame>
                {errors.description && (
                  <p className="-mt-4 font-mono text-[10px] text-[#C9704A]">
                    {errors.description}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full text-[11px] font-mono tracking-[0.2em] uppercase bg-[#F2EEE7] text-[#0B0C0E] px-6 py-3.5 rounded-full hover:bg-[#C98A54] transition-colors"
                >
                  Send & start consultation
                </button>
              </form>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============================ CHAT ============================ */}
      {view === "chat" && (
        <section className="px-6 md:px-14 pb-28">
          <div className="max-w-2xl">
            <Reveal className="border border-white/10 rounded-sm bg-white/2 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <span className="font-mono text-[9px] tracking-[0.15em] text-[#F2EEE7]/40 uppercase">
                  Consultant / live
                </span>
                <span className="font-mono text-[9px] tracking-[0.15em] text-[#C98A54] uppercase">
                  {form.projectType}
                </span>
              </div>

              <div
                ref={scrollBoxRef}
                className="max-h-[50vh] overflow-y-auto p-5 space-y-4"
              >
                {messages
                  .filter((m) => m.display !== false)
                  .map((m, i) => (
                    <div
                      key={i}
                      className={
                        m.role === "user"
                          ? "ml-auto max-w-[85%] bg-white/4 border border-white/10 rounded-sm px-4 py-3 text-sm leading-relaxed"
                          : "mr-auto max-w-[85%] border-l-2 border-[#C98A54] pl-4 py-1 text-sm leading-relaxed text-[#F2EEE7]/85"
                      }
                    >
                      {m.content}
                    </div>
                  ))}
                {loading && (
                  <div className="mr-auto max-w-[85%] border-l-2 border-[#C98A54] pl-4 py-1 text-sm text-[#F2EEE7]/40 font-mono tracking-wide">
                    typing...
                  </div>
                )}
              </div>

              <form
                onSubmit={handleChatSend}
                className="flex gap-2 p-4 border-t border-white/10"
              >
                <input
                  type="text"
                  className={fieldClasses}
                  placeholder="Ask a follow-up..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 text-[11px] font-mono tracking-[0.2em] uppercase bg-[#F2EEE7] text-[#0B0C0E] px-6 rounded-full hover:bg-[#C98A54] transition-colors disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </Reveal>

            <button
              onClick={() => {
                setView("form");
                setMessages([]);
              }}
              className="mt-6 font-mono text-[10px] tracking-[0.2em] uppercase text-[#F2EEE7]/50 hover:text-[#C98A54] transition-colors"
            >
              ← Back to form
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
