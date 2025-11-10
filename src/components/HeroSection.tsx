import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText, FolderGit2 } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentRole, setCurrentRole] = useState(0);
  const roles = ["Aspiring DevOps Engineer", "Data Analytics Enthusiast", "Cloud Computing Student", "Tech Innovation Seeker"];
  
  useEffect(() => {
    let currentIndex = 0;
    const currentText = roles[currentRole];
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= currentText.length) {
        setDisplayedText(currentText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          // Clear text with backspace effect
          const clearingInterval = setInterval(() => {
            if (currentIndex > 0) {
              setDisplayedText(currentText.slice(0, currentIndex));
              currentIndex--;
            } else {
              clearInterval(clearingInterval);
              setCurrentRole((prev) => (prev + 1) % roles.length);
            }
          }, 50);
        }, 2000);
        clearInterval(typeInterval);
      }
    }, 100);
    
    return () => clearInterval(typeInterval);
  }, [currentRole]);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen hero-gradient relative flex items-center justify-center overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl floating animate-pulse-glow"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-tech-accent/10 rounded-full blur-xl floating animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-data-viz/10 rounded-full blur-xl floating animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 right-1/3 w-16 h-16 bg-warning/10 rounded-full blur-xl floating animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-primary/10 rounded-full blur-xl floating animate-pulse-glow" style={{ animationDelay: '4s' }}></div>
        
        {/* Animated particles */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-bounce"
            style={{ 
              top: `${20 + (i * 15)}%`, 
              left: `${10 + (i * 12)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + (i * 0.3)}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Irfan Basha</span>
          </h1>
          
          <div className="text-2xl md:text-3xl mb-8 min-h-[3rem] flex items-center justify-center">
            <span className="text-foreground/80">
              {displayedText}
              <span className="typing-cursor text-primary"></span>
            </span>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-in-right" style={{ animationDelay: '1s' }}>
            Fresh graduate passionate about technology, eager to learn and contribute to innovative projects. 
            Currently building skills in DevOps practices, data analysis, and cloud technologies through hands-on learning and personal projects.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '1.5s' }}>
            <Button 
              size="lg" 
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-effect transition-all duration-500 hover:scale-110 hover:rotate-1 transform"
            >
              <Link to="/cv">
                <FileText className="mr-2 h-5 w-5 animate-bounce" />
                View CV
              </Link>
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToProjects}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary tech-glow transition-all duration-500 hover:scale-110 hover:-rotate-1 transform"
            >
              <FolderGit2 className="mr-2 h-5 w-5 animate-pulse" />
              View Projects
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-primary/60" />
        </div>
      </div>
    </section>
  );
};