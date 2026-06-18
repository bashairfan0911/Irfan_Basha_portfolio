import { useState, useRef } from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Send, Terminal, CheckCircle } from "lucide-react";

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    el.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateZ(5px)`;
  };
  const onLeave = () => { ref.current!.style.transform = "none"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`tilt-card relative transition-transform duration-300 ${className}`}>
      {children}
    </div>
  );
}

const socials = [
  { icon: Mail,     label: "Email",    href: "mailto:bashairfan0911@gmail.com", value: "bashairfan0911@gmail.com", color: "#00d4ff" },
  { icon: Phone,    label: "Phone",    href: "tel:+918610164761",               value: "+91 86101 64761",          color: "#00ff88" },
  { icon: MapPin,   label: "Location", href: "#",                               value: "Chennai, India",           color: "#f59e0b" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/irfan-basha-786ab4245/", value: "irfan-basha-786ab4245", color: "#0A66C2" },
  { icon: Github,   label: "GitHub",   href: "https://github.com/bashairfan0911",                  value: "bashairfan0911",        color: "#e2e8f0" },
];

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyi1eZoWd53OjQrJsjMi0bAeXdj_8PojK2aJMXE3f7z3yYDoL9c8-zLp7IcYYcOgcFD9w/exec";

export const ContactSection = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await fetch(SCRIPT_URL, { method: "POST", body: fd });
      setStatus("sent");
      setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const inputClass = "w-full bg-muted/40 border border-border/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-200 font-mono";

  return (
    <section id="contact" className="py-14 sm:py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-mono text-green-400 uppercase tracking-[0.2em] mb-2 block">&gt;_ contact.sh</span>
          <h2 className="text-2xl sm:text-4xl font-black mb-3">
            <span className="text-gradient-vivid">Get In Touch</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Open to DevOps, Platform Engineering & Agentic AI opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-start">

          {/* ── Left: socials ── */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-4">Connect with me</p>
            {socials.map(({ icon: Icon, label, href, value, color }) => (
              <TiltCard key={label}>
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="flex items-center gap-4 glass-card rounded-xl border border-border/30 p-4 hover:border-border/60 transition-all duration-300 group">
                  <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: `${color}15` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{value}</p>
                  </div>
                </a>
              </TiltCard>
            ))}

            {/* Availability badge */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-green-400/20 bg-green-400/5 mt-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="text-xs font-mono text-green-400">Available for full-time opportunities</span>
            </div>
          </div>

          {/* ── Right: form ── */}
          <TiltCard>
            <div className="glass-card rounded-2xl border border-border/30 overflow-hidden">
              {/* Terminal bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border/30">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <Terminal className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                <span className="text-xs font-mono text-muted-foreground">send_message.sh</span>
              </div>

              <form onSubmit={onSubmit} className="p-5 sm:p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input name="firstName" value={form.firstName} onChange={onChange} placeholder="First name" required className={inputClass} />
                  <input name="lastName"  value={form.lastName}  onChange={onChange} placeholder="Last name"  required className={inputClass} />
                </div>
                <input name="email"   value={form.email}   onChange={onChange} type="email" placeholder="Email address" required className={inputClass} />
                <input name="subject" value={form.subject} onChange={onChange} placeholder="Subject"       required className={inputClass} />
                <textarea name="message" value={form.message} onChange={onChange} placeholder="Your message…" required rows={5}
                  className={`${inputClass} resize-none`} />

                <button type="submit" disabled={status === "sending" || status === "sent"}
                  className="w-full py-3 rounded-xl font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 shadow-neon-blue"
                  style={{ background: "linear-gradient(135deg,hsl(195 100% 55%),hsl(148 100% 50%))", color: "#020810" }}>
                  {status === "sending" && <><span className="animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4" /> Sending…</>}
                  {status === "sent"    && <><CheckCircle className="w-4 h-4" /> Message sent!</>}
                  {status === "error"   && <>Failed — try again</>}
                  {status === "idle"    && <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};
