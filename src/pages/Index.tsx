import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <div id="about"><AboutSection /></div>
      <div id="skills"><SkillsSection /></div>
      <div id="projects"><ProjectsSection /></div>
      <div id="education"><EducationSection /></div>
      <div id="contact"><ContactSection /></div>

      {/* Footer */}
      <footer className="bg-background/80 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Irfan Basha. Fresh graduate ready to make an impact in tech.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;