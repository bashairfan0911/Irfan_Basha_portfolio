import { useRef } from "react";
import { GraduationCap, Calendar, MapPin, Award, ExternalLink } from "lucide-react";

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    el.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateZ(6px)`;
  };
  const onLeave = () => { ref.current!.style.transform = "none"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`tilt-card relative transition-transform duration-300 ${className}`}>
      {children}
    </div>
  );
}

const education = [
  {
    institution: "Aalim Muhammed Salegh College of Engineering",
    degree: "B.E. Computer Science Engineering",
    duration: "2021 – 2025",
    location: "Chennai, Tamil Nadu",
    gpa: "8.0 / 10",
    folio: "AUE11065698",
    status: "Graduated",
    color: "#00d4ff",
    coursework: ["Data Structures & Algorithms","Database Management Systems","Cloud Computing","Software Engineering","Operating Systems","Computer Networks"],
    achievements: ["Best Project Award — Final Year Capstone"],
  },
];

const certifications = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    validity: "July 21, 2025 – July 21, 2028",
    url: "https://www.credly.com/badges/8336f37b-d694-499c-812c-06e86db040c7",
    color: "#FF9900",
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified DevOps Professional",
    issuer: "Oracle",
    validity: "Issued: 2025",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=C8F2CA3627E56BB3A2A887C1F257481548DA7B2A20CF1E747FB5F2893B3A43BB",
    color: "#F80000",
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    validity: "Issued: 2025",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=3856E0F59B786EAEBCBB0D0FA8AC1FD92B0027CDA96A7AF0EAFE77F1078A479E",
    color: "#F80000",
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified Multicloud Architect Professional",
    issuer: "Oracle",
    validity: "Issued: 2025",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=50E592F48CBB302BE2304939448ED70492FCA5B1855170FDCF2013A26E106BBE",
    color: "#F80000",
  },
  {
    title: "Oracle Analytics Cloud",
    issuer: "Oracle",
    validity: "Sep 2025 – Sep 2027",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=6109577756FDC4BDD9D3E711C9C2BC946F293D82EEA2F6C93FAF07F8D6508F68",
    color: "#F80000",
  },
  {
    title: "Google Data Analytics Professional Certificate",
    issuer: "Google / Coursera",
    validity: "Issued: March 21, 2025",
    url: "https://www.credly.com/badges/dc2deaa4-1d54-40c1-b8e6-5be2badfb151/public_url",
    color: "#4285F4",
  },
  {
    title: "MongoDB Node.js Developer Path",
    issuer: "MongoDB / SmartBridge",
    validity: "ID: MDBuj0lzlt386",
    url: "https://learn.mongodb.com/c/4lcMpkcbT2qLXmVqnGyIEw",
    color: "#00ED64",
  },
];

export const EducationSection = () => (
  <section id="education" className="py-14 sm:py-20 relative overflow-hidden bg-card/30">
    <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />

    <div className="container mx-auto px-4 relative z-10">
      {/* Heading */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-xs font-mono text-green-400 uppercase tracking-[0.2em] mb-2 block">&gt;_ education.log</span>
        <h2 className="text-2xl sm:text-4xl font-black mb-3">
          <span className="text-gradient-vivid">Education & Certifications</span>
        </h2>
      </div>

      {/* Degree card */}
      {education.map((edu) => (
        <TiltCard key={edu.institution} className="mb-10">
          <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden">
            <div className="h-1" style={{ background: `linear-gradient(90deg,${edu.color},${edu.color}44)` }} />
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-primary/80 font-mono">{edu.institution}</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-green-400/30 text-green-400 bg-green-400/10">{edu.status}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-mono mb-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{edu.duration}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{edu.location}</span>
                <span className="flex items-center gap-1.5 text-yellow-400"><Award className="w-3.5 h-3.5" />GPA: {edu.gpa}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">Coursework</p>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.coursework.map((c) => (
                      <span key={c} className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground bg-white/[0.02]">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">Achievements</p>
                  {edu.achievements.map((a) => (
                    <div key={a} className="flex items-start gap-2 text-xs text-foreground/80">
                      <span className="text-primary mt-0.5">✦</span>{a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TiltCard>
      ))}

      {/* Certifications grid */}
      <div>
        <h3 className="text-center text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6">Certifications</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {certifications.map((cert) => (
            <TiltCard key={cert.title}>
              <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <div className="glass-card rounded-xl border border-border/30 p-4 h-full flex flex-col gap-2 hover:border-border/60 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color: cert.color, borderColor: `${cert.color}40`, background: `${cert.color}10` }}>
                      {cert.issuer}
                    </span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-snug flex-1">{cert.title}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{cert.validity}</p>
                </div>
              </a>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  </section>
);