import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import { ProfessionalSummary } from "@/components/ProfessionalSummary";
import { TechnicalExpertise } from "@/components/TechnicalExpertise";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CV = () => {
  return (
    <main className="overflow-x-hidden">
      {/* Header */}
      <section className="py-12 bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="text-gradient">Curriculum Vitae</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Irfan Basha - DevOps Engineer & Data Analyst
              </p>
            </div>
            
            <a href="/images/IRFAN_BASHA_devops.pdf" download="Irfan_Basha_Resume.pdf">
              <Button className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CV Sections */}
      <ProfessionalSummary />
      <TechnicalExpertise />
      <ExperienceSection />
      <EducationSection />
      
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

export default CV;
